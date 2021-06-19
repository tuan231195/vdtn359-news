SHELL=/bin/bash
ansible_tags =

ifeq ($(ansible_tags),)
	ansible_opts=
else
	ansible_opts=--tags $(ansible_tags)
endif

buildCI:
	docker build -t vdtn359/news-ci -f Dockerfile.ci .

buildProdImage:
	docker build -t vdtn359/news-prod -f Dockerfile.prod .

buildPacker:
	export DIGITALOCEAN_TOKEN=$(shell secrethub read vdtn359/start/vdtn359-news/digitalocean-token); \
	cd infra/packer && packer build vdtn359.json

provisionDigitalOcean:
	cd infra/terraform/digitalocean; \
	terraform init; \
	terraform apply -auto-approve

provisionHeroku:
	cd infra/terraform/heroku; \
	terraform init; \
	terraform apply -auto-approve

playbook:
	cd infra/ansible && ansible-playbook -v main.yml $(ansible_opts)

pushCI: buildCI
	docker push vdtn359/news-ci

pushProdImage: buildProdImage
	docker push vdtn359/news-prod

releaseCrawler:
	node common/scripts/install-run-rush.js deploy-tools -a deploy -p @vdtn359/news-crawler

releaseScheduler:
	node common/scripts/install-run-rush.js deploy-tools -a deploy -p @vdtn359/news-scheduler

releaseWorker:
	node common/scripts/install-run-rush.js deploy-tools -a deploy -p @vdtn359/news-worker

releaseWeb:
	node common/scripts/install-run-rush.js deploy-tools -a deploy -p @vdtn359/news-web

commitHashes:
	. ./common/scripts/commit-hashes.sh
