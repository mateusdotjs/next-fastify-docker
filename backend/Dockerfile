FROM node:22.16.0-alpine

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install
# Copia tudo (inclui schema.prisma e migrations)
COPY . .

RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "npm run db:deploy && npm run start"]