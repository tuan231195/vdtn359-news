#!/usr/bin/env bash

cd ../..
mkdir -p common/artifacts
node common/scripts/install-run-rush.js deploy -p @vdtn359/news-worker --create-archive ../artifacts/news-worker.zip --overwrite
docker build -t registry.heroku.com/vdtn359-news/worker:$BUILD_HASH -f apps/worker/Dockerfile --progress plain .
docker tag registry.heroku.com/vdtn359-news/worker:$BUILD_HASH registry.heroku.com/vdtn359-news/worker:latest
docker push registry.heroku.com/vdtn359-news/worker:$BUILD_HASH
docker push registry.heroku.com/vdtn359-news/worker:latest
heroku container:release -a vdtn359-news worker
