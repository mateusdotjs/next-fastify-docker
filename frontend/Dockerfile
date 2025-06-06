# Etapa 1: Ambiente base
FROM node:22.16.0-alpine

# Diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependência
COPY package.json package-lock.json* ./
COPY . .


# Instala as dependências
RUN npm install

# Copia todo o restante do código do frontend
COPY . .

# Gera o build da aplicação Next.js
RUN npm run build

# Expondo a porta padrão do Next.js
EXPOSE 3001

# Comando para rodar o Next.js em produção
CMD ["npm", "run", "start"]
