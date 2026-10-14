import dotenv from 'dotenv';
dotenv.config();

import readline from 'readline';
import User from '../src/models/User.js';
import { connectDB, disconnectDB } from '../src/config/db.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const run = async () => {
  try {
    await connectDB();

    console.log('\n--- Nail Salon & Spa: Superadmin Provisioning Tool ---\n');

    const name = (await question('Admin Full Name [Default: Victoria Hastings]: ')) || 'Victoria Hastings';
    const email = (await question('Admin Email [Default: admin@nailsalonandspa.com]: ')) || 'admin@nailsalonandspa.com';
    const password = (await question('Admin Password (min 6 chars) [Default: Password@123]: ')) || 'Password@123';
    const role = (await question('Role (superadmin/admin/manager/receptionist) [Default: superadmin]: ')) || 'superadmin';

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      console.log(`\nUser with email ${email} already exists. Updating credentials...`);
      existing.name = name;
      existing.password = password;
      existing.role = role;
      existing.active = true;
      await existing.save();
      console.log('Admin user updated successfully.');
    } else {
      await User.create({
        name,
        email: email.toLowerCase(),
        password,
        role,
        active: true,
      });
      console.log('\nNew superadmin account created successfully!');
    }

    console.log(`Credentials:`);
    console.log(`Email: ${email}`);
    console.log(`Role:  ${role}\n`);

    rl.close();
    await disconnectDB();
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin user:', err.message);
    rl.close();
    process.exit(1);
  }
};

run();
