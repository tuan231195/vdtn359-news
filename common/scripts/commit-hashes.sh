#! /usr/bin/env bash

set -eo pipefail
git add apps/*/build-hash.info
if git diff --exit-code --cached >> /dev/null ; then
  exit 0
fi
BRANCH=$(git symbolic-ref --short HEAD)
TMP_FILE=$(mktemp)

git stash
git pull origin "$BRANCH" --rebase
git stash pop --index
printf "chore(build): update build hashes [skip ci]\n\n" > "$TMP_FILE"
git diff --name-only --cached | xargs -I {} sh -c "cat {} | awk '{print}' | sed -e 's#^#update {} to #' >> $TMP_FILE"

git commit -F "$TMP_FILE" --no-verify
git push origin "$BRANCH"
