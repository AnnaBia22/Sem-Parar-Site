# Estágio de Build
FROM node:18-alpine AS build
RUN apk update && apk add --no-cache build-base gcc autoconf automake libtool zlib-dev libpng-dev nasm bash vips-dev git
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/
COPY package.json package-lock.json ./
RUN npm global upgrade npx
RUN npm ci --only=production
ENV PATH /opt/node_modules/.bin:$PATH

WORKDIR /opt/app
COPY . .
RUN npm run build

# Estágio de Execução
FROM node:18-alpine
RUN apk add --no-cache vips-dev
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/
COPY --from=build /opt/node_modules ./node_modules
ENV PATH /opt/node_modules/.bin:$PATH

WORKDIR /opt/app
COPY --from=build /opt/app ./

# O Hugging Face Spaces roda na porta 7860 por padrão
EXPOSE 7860
ENV PORT=7860

CMD ["npm", "run", "start"]