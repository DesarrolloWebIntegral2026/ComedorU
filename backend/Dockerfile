# Imagen base ligera de Node.js
FROM node:22-alpine

# Directorio de trabajo en el contenedor
WORKDIR /app

# Copiar archivos de dependencias de la raíz
COPY package*.json ./

# Instalar dependencias del backend ignorando scripts de husky/git hooks
RUN npm install --omit=dev --ignore-scripts

# Copiar el código del backend
COPY backend/ ./backend/

# Exponer el puerto del API
EXPOSE 3000

# Variable de entorno de puerto por defecto
ENV PORT=3000

# Comando de inicio del servidor
CMD ["node", "backend/server.js"]
