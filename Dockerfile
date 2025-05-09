# Imagen base
FROM node:20

# Crea directorio de trabajo
WORKDIR /usr/src/app

# Copia archivos
COPY package*.json ./
RUN npm install

COPY . .

# Expone el puerto
EXPOSE 8080

COPY public ./public


# Comando para arrancar la app
CMD ["npm", "start"]
