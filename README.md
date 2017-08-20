I don't really feel like documenting this right now, but hey...

create an env file in env/foo and make it look something like

```
TWITTER_CONSUMER_KEY=XXXXXXXXXXXXXXXXXXXXXXXXX
TWITTER_CONSUMER_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWITTER_ACCESS_TOKEN_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWITTER_ACCESS_TOKEN_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWITTER_USER_ID=XXXXXXXX
```

build the docker image, tag it, push or or something... edit the docker-compose
file to use the correct env file and image. then you're good...
