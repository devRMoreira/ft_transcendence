FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Generate Prisma Client and Build Next.js
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

# Run migrations, seed the database, and start the app
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && npm start"]