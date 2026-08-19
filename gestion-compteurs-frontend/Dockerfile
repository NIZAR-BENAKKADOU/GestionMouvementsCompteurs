# =========================================================
# Dockerfile - Frontend React (Build context = gestion-compteurs-frontend/)
# =========================================================

# Stage 1: Build React
FROM node:18-alpine AS build

# Argument pour l'URL de l'API (configurable au build)
ARG REACT_APP_API_URL=http://localhost:5141/api
ENV REACT_APP_API_URL=$REACT_APP_API_URL

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# Stage 2: Servir avec nginx
FROM nginx:alpine AS final

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
