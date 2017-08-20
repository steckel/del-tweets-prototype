const Twitter = require("twitter");
const kue = require("kue");
const envvar = require("envvar");

// Constants -------------------------------------------------------------------

const TWITTER_CONSUMER_KEY = envvar.string("TWITTER_CONSUMER_KEY");
const TWITTER_CONSUMER_SECRET = envvar.string("TWITTER_CONSUMER_SECRET");
const TWITTER_ACCESS_TOKEN_KEY = envvar.string("TWITTER_ACCESS_TOKEN_KEY");
const TWITTER_ACCESS_TOKEN_SECRET = envvar.string("TWITTER_ACCESS_TOKEN_SECRET");
const TWITTER_USER_ID = envvar.string("TWITTER_USER_ID");

const MINUTE = 1000 * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

// Kue ------------------------------------------------------------------------

const queue = kue.createQueue({ redis: { host: 'redis' } });
kue.app.listen(3000);

process.on('SIGTERM', function() {
  queue.shutdown(5000, function(err) {
    console.log('Kue shutdown: ', err);
    process.exit(0);
  });
});

// Twitter --------------------------------------------------------------------

const onData = (userId, queue) => (tweet) => {
  if (tweet.user.id_str === userId) {
    console.log("enqueing tweet for removal...");
    queue.create('deletion', tweet)
      .delay(DAY * 3)
      .save()
  } else {
    console.log("ignoring tweet...");
  }
};

const removeTweet = (client) => (job, done) => {
  const tweet = job.data;
  const requestURL = tweet.hasOwnProperty("retweeted_status")
    ? `statuses/unretweet/${tweet.id_str}`
    : `statuses/destroy/${tweet.id_str}`
    ;

  client.post(requestURL, (error) => {
    if (error != null) { 
      done(error);
    } else {
      done();
    }
  });
};

const client = new Twitter({
  consumer_key: TWITTER_CONSUMER_KEY,
  consumer_secret: TWITTER_CONSUMER_SECRET,
  access_token_key: TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: TWITTER_ACCESS_TOKEN_SECRET
});

client.stream('user', {with: "user"},  (stream) => {
  stream.on('data', onData(TWITTER_USER_ID, queue))
  stream.on('error', console.error);
});

// Kue ------------------------------------------------------------------------

queue.process('deletion', 10, removeTweet(client));
