#!/usr/bin/env bash

LAMBDA_VERSION="$(aws lambda list-tags --region ap-southeast-2 --resource arn:aws:lambda:ap-southeast-2:923678104243:function:vdtn359-news-scheduler-cleanup --query 'Tags.version')"
PACKAGE_VERSION="$(cat package.json | jq '.version')"

if [ "$PACKAGE_VERSION" != "$LAMBDA_VERSION" ]; then
  echo "Deploying version $PACKAGE_VERSION"
  npm run package
  cd terraform || return
  terraform init
	terraform apply -auto-approve
else
  echo "Nothing has changed"
fi
