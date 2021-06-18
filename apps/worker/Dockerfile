FROM vdtn359/news-prod

ENV APP_DIR /opt

WORKDIR "${APP_DIR}"

COPY ["common/artifacts/news-worker.zip", "${APP_DIR}/"]

RUN unzip -qo news-worker.zip && rm news-worker.zip

WORKDIR "${APP_DIR}"/apps/worker

ENV NODE_ENV production
ENV NODE_CONFIG_ENV production

CMD ["npm", "start"]
