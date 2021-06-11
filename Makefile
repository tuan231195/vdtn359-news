SHELL=/bin/bash
ansible_tags =

ifeq ($(ansible_tags),)
	ansible_opts=
else
	ansible_opts=--tags $(ansible_tags)
endif

buildCI:
	docker build -t vdtn359/news-ci -f Dockerfile.ci .

copyManifest:
	tar -cvzf manifest.tar.gz {apps,packages,tools}/*/package.json common/{config,scripts} package.json rush.json

buildRoot: copyManifest
	docker build -t vdtn359/news-root .
	rm -rf manifest.tar.gz

buildRoot:
	docker build -t vdtn359/news-ci .

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

provisionCrawler:
	cd apps/crawler && ./deploy.sh

provisionScheduler:
	cd apps/scheduler && ./deploy.sh

playbook:
	cd infra/ansible && ansible-playbook -v main.yml $(ansible_opts)

pushCI: buildCI
	docker push vdtn359/news-ci

buildWorker:
	cd apps/worker && ./deploy.sh

buildWeb:
	cd apps/web && ./deploy.sh

releaseWorker:
	heroku container:release -a vdtn359-news worker

releaseWeb:
	heroku container:release -a vdtn359-news web
