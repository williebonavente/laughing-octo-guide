// src/auth/login.ts
import inquirer from 'inquirer';
import bcrypt from 'bcrypt';
import { db } from '../db/init';

export async function login() {
  console.log('\n-- Login --');
  const { username, password } = await inquirer.prompt([
    { name: 'username', message: 'Enter username:', validate: input => input.trim() !== '' },
    { type: 'password', name: 'password', message: 'Enter password:' },
  ]);

  const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
  const user = stmt.get(username);

  if (!user) {
    console.error('❌ User not found.');
    return;
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    console.error('❌ Incorrect password.');
    return;
  }

  console.log(`\n✅ Welcome back, ${user.username}!`);
  console.log(`🎯 Level: ${user.level}\n🎯 Goal: ${user.goal}\n🎯 Layout: ${user.layout}`);

  // Return user profile for further processing (e.g., LLM feedback context)
  return {
    id: user.id,
    username: user.username,
    level: user.level,
    goal: user.goal,
    layout: user.layout,
  };
}
