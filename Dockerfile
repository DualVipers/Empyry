FROM node:16-alpine AS builder

WORKDIR /usr/src/Empyry

RUN mkdir -p /usr/src/Empyry

COPY package.json /usr/src/Empyry/package.json
COPY yarn.lock /usr/src/Empyry/yarn.lock
COPY core/package.json /usr/src/Empyry/core/package.json

RUN yarn install --production

FROM node:16-alpine AS dev

WORKDIR /usr/src/Empyry

COPY core/ /usr/src/Empyry/
COPY --from=builder /usr/src/Empyry/core/node_modules/ /usr/src/Empyry/node_modules/
COPY managers/helm/ /usr/src/EmpyryManagers/helm/

EXPOSE 9000
VOLUME ["/root/.local/share/Empyry", "/root/.config/Empyry", "/root/.local/state/Empyry"]

ENTRYPOINT [ "yarn" ]
CMD [ "start" ]

FROM node:16-alpine

WORKDIR /usr/src/Empyry

COPY core/ /usr/src/Empyry/
COPY --from=builder /usr/src/Empyry/core/node_modules/ /usr/src/Empyry/node_modules/

EXPOSE 9000
VOLUME ["/root/.local/share/Empyry", "/root/.config/Empyry", "/root/.local/state/Empyry"]

ENTRYPOINT [ "yarn" ]
CMD [ "start" ]
