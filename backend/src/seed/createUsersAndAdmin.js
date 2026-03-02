const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const connectDB = require('../config/db');
const User = require('../models/User');

const run = async () => {
  await connectDB();

  const accounts = [
    // ── Admin ──────────────────────────────────────────────────────────────────
    {
      name: 'GameON Admin',
      email: 'admin@gameon.com',
      password: 'Admin@GameON2026',
      role: 'admin',
    },
    // ── Regular users ──────────────────────────────────────────────────────────
    {
      name: 'Prathamesh Konduskar',
      email: 'Prathmeshkonduskar01@gmail.com',
      password: 'User@GameON2026',
      role: 'user',
    },
    {
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@gmail.com',
      password: 'customer123',
      role: 'user',
    },
    {
      name: 'Priya Sharma',
      email: 'priya.sharma@gmail.com',
      password: 'customer123',
      role: 'user',
    },
    {
      name: 'Amit Patel',
      email: 'amit.patel@gmail.com',
      password: 'customer123',
      role: 'user',
    },
    {
      name: 'Sneha Reddy',
      email: 'sneha.reddy@gmail.com',
      password: 'customer123',
      role: 'user',
    },
    {
      name: 'Vikram Singh',
      email: 'vikram.singh@gmail.com',
      password: 'customer123',
      role: 'user',
    },
  ];

  console.log('\n🚀 Creating users on MongoDB Atlas...\n');

  for (const account of accounts) {
    const existing = await User.findOne({ email: account.email });
    if (existing) {
      console.log(`⚠️  Already exists  [${account.role}] ${account.name} <${account.email}>`);
      continue;
    }
    await User.create(account);
    console.log(`✅ Created          [${account.role}] ${account.name} <${account.email}>`);
  }

  console.log('\n─────────────────────────────────────────────────────');
  console.log('Login credentials:');
  console.log('  Admin   → admin@gameon.com          / Admin@GameON2026');
  console.log('  You     → Prathmeshkonduskar01@gmail.com / User@GameON2026');
  console.log('  Others  → <email>                   / customer123');
  console.log('─────────────────────────────────────────────────────\n');

  process.exit(0);
};

run().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
