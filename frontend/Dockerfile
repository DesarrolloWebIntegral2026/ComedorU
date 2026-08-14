# Etapa 1: Construcción de la aplicación web React + Vite
FROM node:20-alpine AS build

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el código fuente del frontend
COPY . .

# Generar la versión de producción optimizada
RUN npm run build

# Etapa 2: Servidor web Nginx para servir el componente web
FROM nginx:alpine

# Copiar configuración personalizada para React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos compilados de la etapa anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
