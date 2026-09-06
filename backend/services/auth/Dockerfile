# 1. Base image (Lightweight Node.js environment)
FROM node:18-alpine

# 2. Container ke andar working directory set karein
WORKDIR /usr/src/app

# 3. Pehle package.json copy karein (taaki caching ka fayda mile)
COPY package*.json ./

# 4. Dependencies install karein
RUN npm install --legacy-peer-deps

# 5. Baki saara code copy karein
COPY . .

# 6. Project start karne ki command (Make sure aapke package.json mein "start" script ho)
CMD ["npm", "start"]