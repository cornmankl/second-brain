#!/bin/bash

echo "🚀 Starting Vercel build process..."

# Ensure we're in the right directory
cd "$(dirname "$0")"

echo "📦 Installing dependencies..."
npm install

echo "🔄 Generating Prisma client..."
npx prisma generate

echo "🗄️ Pushing database schema..."
npx prisma db push

echo "🏗️ Building Next.js application..."
npm run build

echo "✅ Build completed successfully!"