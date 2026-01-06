import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'node:path';
import chalk from 'chalk';

const TEST_DIR = path.resolve(process.cwd(), 'temp-test-projects');

async function runTest(name: string, framework: string, database: string, orm: string) {
  console.log(chalk.blue(`\nTesting: ${name} (${framework}, ${database}, ${orm})...`));
  const projectDir = path.join(TEST_DIR, name);

  try {
    // 1. Run the CLI
    await execa('node', [
      'dist/index.js',
      name
    ], {
      input: '\n\n\n\n', // Accept defaults or assume first options
      env: { ...process.env, PROJECT_NAME: name, FRAMEWORK: framework, DATABASE: database, ORM: orm }
    });

    // Note: The current CLI implementation is interactive and uses clack. 
    // Testing purely interactive CLIs is tricky without proper TTY simulation.
    // For this sanity check, we will manually verify a few outputs if we can't automate the prompts easily.
    
    console.log(chalk.green(`✅ ${name} generated successfully.`));
  } catch (error) {
    console.error(chalk.red(`❌ ${name} failed:`));
    console.error(error);
  }
}

async function main() {
  await fs.ensureDir(TEST_DIR);
  
  // Build the project first
  console.log(chalk.yellow('Building kodkod-stack...'));
  await execa('npm', ['run', 'build']);

  // For now, let's just run one and see
  // To automate clack, we might need a more sophisticated approach or a test-only flag in index.ts
  
  console.log(chalk.yellow('\nManual sanity check recommended until automated prompt testing is robust.'));
  console.log(chalk.dim('You can run: node dist/index.js test-project'));
}

main();
