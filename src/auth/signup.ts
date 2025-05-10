// src/auth/signup.ts
import inquirer from 'inquirer';
import bcrypt from 'bcrypt';
import { db } from '../db/init';

export async function signup() {
  console.log('\n-- Signup --');
  const answers = await inquirer.prompt([
    { name: 'username', message: 'Enter username:', validate: input => input.trim() !== '' },
    { type: 'password', name: 'password', message: 'Enter password:' },
    { type: 'list', name: 'level', message: 'Typing Level:', choices: ['Beginner', 'Intermediate', 'Advanced'] },
    { name: 'goal', message: 'Your typing goal (e.g., speed, accuracy):' },
    { type: 'list', name: 'layout', message: 'Keyboard layout:', choices: ['QWERTY', 'Dvorak', 'Colemak'] },
  ]);

  const hashedPassword = await bcrypt.hash(answers.password, 10);

  try {
    const stmt = db.prepare(
      'INSERT INTO users (username, password, level, goal, layout) VALUES (?, ?, ?, ?, ?)'
    );
    stmt.run(answers.username, hashedPassword, answers.level, answers.goal, answers.layout);
    console.log(`\n✅ User '${answers.username}' created successfully!`);
  } catch (err: any) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      console.error('❌ Username already exists. Try a different one.');
    } else {
      console.error('❌ Failed to create user:', err.message);
    }
  }
}
