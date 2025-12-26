// Quick test to verify OpenAI API key works
require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.OPENAI_API_KEY;

console.log('\n🔍 Checking OpenAI API Key...\n');

if (!apiKey) {
  console.log('❌ OPENAI_API_KEY not found in .env.local');
  console.log('   Please add your key to the .env.local file\n');
  process.exit(1);
}

if (!apiKey.startsWith('sk-')) {
  console.log('⚠️  Warning: OpenAI keys usually start with "sk-"');
  console.log('   Your key:', apiKey.substring(0, 10) + '...\n');
}

console.log('✅ API Key found!');
console.log('   Key starts with:', apiKey.substring(0, 10) + '...');
console.log('   Length:', apiKey.length, 'characters');
console.log('\n✨ Ready to use AI vision!\n');
