const fs = require('fs');
const path = require('path');

// Get environment variables from Vercel
const supabaseUrl = process.env.SUPABASE_URL || 'https://bznpqlvdrendayeyanxe.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'sb_publishable_jpryfpXnwJcl1mh7eNNIGA_-n5dNWYA';

const envDir = path.join(__dirname, 'src', 'environments');

// Ensure environments directory exists
if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true });
}

// Create environment.ts
const envContent = `export const environment = {
  production: false,
  supabaseUrl: '${supabaseUrl}',
  supabaseKey: '${supabaseKey}'
};
`;

// Create environment.prod.ts
const envProdContent = `export const environment = {
  production: true,
  supabaseUrl: '${supabaseUrl}',
  supabaseKey: '${supabaseKey}'
};
`;

// Write files
fs.writeFileSync(path.join(envDir, 'environment.ts'), envContent);
fs.writeFileSync(path.join(envDir, 'environment.prod.ts'), envProdContent);

console.log('✅ Environment files generated successfully!');
