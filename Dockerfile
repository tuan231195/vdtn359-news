FROM vdtn359/news-ci AS build

WORKDIR /opt/root
ADD manifest.tar.gz /opt/root

RUN node ./common/scripts/install-run-rush.js install
