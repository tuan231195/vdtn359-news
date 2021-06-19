#!/usr/bin/env bash
set -eo pipefail

cd ../..
mkdir -p common/artifacts
node common/scripts/install-run-rush.js deploy -p @vdtn359/news-web --create-archive ../artifacts/news-web.zip --overwrite
docker build -t registry.heroku.com/vdtn359-news/web:$BUILD_HASH -f apps/web/Dockerfile --progress plain .
docker tag registry.heroku.com/vdtn359-news/web:$BUILD_HASH registry.heroku.com/vdtn359-news/web:latest
docker push registry.heroku.com/vdtn359-news/web:$BUILD_HASH
docker push registry.heroku.com/vdtn359-news/web:latest
heroku container:release -a vdtn359-news web
