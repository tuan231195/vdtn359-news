## News application

A simple news application that collects data from multiple sources and syncs them to Elasticsearch for displaying and searching. Developed and deployed via pnpm workspace.

Available at: 
https://www.vdtn359.com

## Tech stack

Web technologies:
* NextJs
* React
* TypeScript
* Worker Threads
* RxJs
* Service worker
* Webpack
* Pnpm

Error Reporting and Logging
* Logz.io
* Logrocket
* Sentry.io

Databases:
* ElasticSearch
* Google Firestore
* Redis

CI:
* CircleCI
* Terraform
* Ansible
* Docker
* Packer

Deployment:
* AWS lambda
* Auth0
* DigitalOcean (self-hosted Elasticsearch)
* Heroku

### Architecture

![Architecture](https://i.imgur.com/XptGzQK.png "Architecture Diagram")

### Development

* Install dependencies

```bash
pnpm recursive install
```

* Run local services

```bash
docker-compose up -d
```

* Compile and watch packages

```bash
npm run cli -- watchPackages
```

* Inside each app folder, run the dev command

```bash
npm run dev
```

* The application will be available at http://localhost:3000

* To commit, make sure you have installed commitizen (`npm i -g commitizen`) and then

```bash
git cz
```
