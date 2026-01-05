import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { intro, outro, select, isCancel, cancel, spinner } from '@clack/prompts';
import chalk from 'chalk';
import { addAuthModule } from './modules/auth.js';

interface ProjectConfig {
  framework: 'express' | 'hono' | 'fastify';
  orm: 'prisma' | 'drizzle';
  database: string;
}

function detectProjectConfig(projectDir: string): ProjectConfig | null {
  const packageJsonPath = join(projectDir, 'package.json');
  
  if (!existsSync(packageJsonPath)) {
    return null;
  }

  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

  // Detect framework
  let framework: ProjectConfig['framework'] = 'express';
  if (deps['hono']) framework = 'hono';
  else if (deps['fastify']) framework = 'fastify';
  else if (deps['express']) framework = 'express';

  // Detect ORM
  let orm: ProjectConfig['orm'] = 'prisma';
  if (deps['drizzle-orm']) orm = 'drizzle';
  else if (deps['@prisma/client'] || deps['prisma']) orm = 'prisma';

  // Detect database (from env or prisma schema)
  let database = 'postgresql';

  return { framework, orm, database };
}

export async function handleAddCommand(module: string, projectDir: string) {
  intro(`${chalk.bgBlue.white(' antstack add ')} ${chalk.cyan(module)}`);

  const config = detectProjectConfig(projectDir);
  
  if (!config) {
    console.error(chalk.red('Error: Could not detect project configuration.'));
    console.error(chalk.yellow('Make sure you are running this command from an antstack-js project root.'));
    process.exit(1);
  }

  console.log(chalk.dim(`Detected: ${config.framework} + ${config.orm}`));

  const s = spinner();

  switch (module) {
    case 'auth':
      s.start('Adding authentication module...');
      try {
        await addAuthModule(projectDir, config);
        s.stop('Authentication module added successfully!');
        
        outro(chalk.green(`
✓ Auth module installed!

${chalk.cyan('Next steps:')}
1. Add JWT_SECRET to your .env file
2. Run ${chalk.yellow('npm install')} to install new dependencies
3. Run migrations if using Prisma: ${chalk.yellow('npx prisma migrate dev')}
4. Import auth routes in your main file

${chalk.dim('Endpoints added:')}
  POST /auth/register - Create new user
  POST /auth/login    - Login and get JWT
  GET  /auth/me       - Get current user (protected)
`));
      } catch (error) {
        s.stop('Failed to add auth module.');
        console.error(chalk.red(error));
        process.exit(1);
      }
      break;

    default:
      console.error(chalk.red(`Unknown module: ${module}`));
      console.log(chalk.yellow('Available modules: auth'));
      process.exit(1);
  }
}
