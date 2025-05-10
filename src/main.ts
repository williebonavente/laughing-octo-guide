// src/main.ts
import inquirer from 'inquirer';
import { initDB } from './db/init';
import { signup } from './auth/signup';
import { login } from './auth/login';
import { runFeedbackSession } from './feedback/session';

async function main() {
  initDB();

  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: ['Login', 'Signup'],
    },
  ]);

  let userProfile = null;
  if (action === 'Signup') {
    await signup();
    userProfile = await login();
  } else {
    userProfile = await login();
  }

  if (userProfile) {
    await runFeedbackSession(userProfile);
  }
}

main();
