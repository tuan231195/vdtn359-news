FROM node:12-alpine
ENV TERRAFORM_VERSION=0.12.20

RUN apk update && apk upgrade && \
    apk add --no-cache bash wget git openssh curl jq make zip

RUN wget https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip && \
    unzip terraform_${TERRAFORM_VERSION}_linux_amd64.zip -d /usr/bin

RUN npm install -g pnpm@4.12.1 @vdtn359/mono-install

RUN curl https://cli-assets.heroku.com/install.sh | sh
RUN apk add --repository https://alpine.secrethub.io/alpine/edge/main --allow-untrusted secrethub-cli
RUN mkdir -p ~/.terraform.d/plugins && curl -SfL https://github.com/secrethub/terraform-provider-secrethub/releases/latest/download/terraform-provider-secrethub-linux-amd64.tar.gz | tar zxf - -C ~/.terraform.d/plugins

RUN apk add python3 py3-pip
RUN ln -s /usr/bin/python3 /usr/bin/python
RUN pip3 install awscli
