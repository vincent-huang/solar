# Build stage
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Serve stage
FROM node:22-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/src ./src
COPY --from=build /app/package*.json ./
RUN npm ci
ENV NODE_ENV=production
ENV PORT=80
EXPOSE 80
CMD ["npx", "tsx", "src/server/index.ts"]
