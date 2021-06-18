FROM vdtn359/news-prod

ENV APP_DIR /opt

WORKDIR "${APP_DIR}"

COPY ["common/artifacts/news-web.zip", "${APP_DIR}/"]

RUN unzip -qo news-web.zip && rm news-web.zip

WORKDIR "${APP_DIR}"/apps/web

ENV NODE_ENV production
ENV NODE_CONFIG_ENV production

CMD ["npm", "start"]
