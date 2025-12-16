FROM node:24-alpine3.23

WORKDIR /app

RUN corepack enable

COPY package.json .
COPY pnpm-lock.yaml .
RUN yes | pnpm install

COPY . .

RUN pnpm build:app

RUN cp -r dist/* public/

RUN pnpm build:server

RUN chmod +x start.sh

EXPOSE 3000

CMD ["./start.sh"]