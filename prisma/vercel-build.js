const { execSync } = require('child_process');

console.log('🔄 Running Prisma generation for Vercel...');

try {
  // Generate Prisma client
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Push database schema (for SQLite)
  console.log('🗄️ Pushing database schema...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  
  console.log('✅ Prisma setup completed successfully!');
} catch (error) {
  console.error('❌ Prisma setup failed:', error.message);
  process.exit(1);
}