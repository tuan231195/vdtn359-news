FROM vdtn359/news-ci AS build

WORKDIR /opt/app
ADD . /opt/app
RUN cd /opt/app/produles && pnpm recursive install --prod --frozen-lockfile=false

FROM node:12-alpine AS prod

WORKDIR /opt/app
RUN mkdir -p /opt/app
COPY --from=build /opt/app/produles/node_modules /opt/app/node_modules
COPY --from=build /opt/app/.next /opt/app/.next
COPY --from=build /opt/app/public /opt/app/public
COPY --from=build /opt/app/produles/package.json /opt/app/package.json
ENV NODE_ENV production
CMD ["npm", "start"]

