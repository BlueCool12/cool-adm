# 1. 빌드 환경
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# 2. 런 타임
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

EXPOSE 3000
CMD ["node", "dist/main"]