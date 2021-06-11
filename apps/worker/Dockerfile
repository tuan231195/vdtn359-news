FROM vdtn359/news-root AS build

COPY . /opt/root
WORKDIR /opt/root
RUN ./common/scripts/install-run-rush.js build -t @vdtn359/news-worker
RUN ./common/scripts/install-run-rush.js deploy -p @vdtn359/news-worker
