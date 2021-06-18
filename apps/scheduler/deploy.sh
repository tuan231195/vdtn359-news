#!/usr/bin/env bash

set -eo pipefail
node ../../common/scripts/install-run-rush.js deploy -p @vdtn359/news-scheduler --overwrite
cd terraform || return
terraform init
terraform apply -auto-approve --var "build_hash=${BUILD_HASH}"
