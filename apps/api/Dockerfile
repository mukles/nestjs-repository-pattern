# Stage 1: Base image for all subsequent stages
FROM node:20-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./

# Stage 2: Install dependencies
FROM base AS deps
RUN npm ci

# Stage 3: Build the application for production
FROM deps AS build
COPY tsconfig*.json ./
COPY src ./src
COPY config ./config 
RUN npm run build

# Stage 4: Development image
FROM deps AS dev
ENV NODE_ENV=development
COPY . .
CMD ["npm", "run", "start:dev"]

# Stage 5: Migrations image - will run once and exit
FROM deps AS migrations
ENV NODE_ENV=development
COPY . .
CMD ["npm", "run", "migration:run"]

# Stage 6: Production image
FROM node:20-alpine AS prod
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY --from=build /usr/src/app/dist ./dist
COPY package*.json ./
RUN npm ci --omit=dev
CMD ["node", "dist/main.js"]
