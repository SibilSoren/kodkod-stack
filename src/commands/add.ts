import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { intro, outro, select, isCancel, cancel, spinner } from '@clack/prompts';
import chalk from 'chalk';
import { addAuthModule } from './modules/auth.js';
import { addSwaggerModule } from './modules/swagger.js';
import { addTestModule } from './modules/test.js';

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
  intro(`${chalk.bgHex('#B45309').white(' kodkod add ')} ${chalk.cyan(module)}`);

  const config = detectProjectConfig(projectDir);
  
  if (!config) {
    console.error(chalk.red('Error: Could not detect project configuration.'));
    console.error(chalk.yellow('Make sure you are running this command from a kodkod project root.'));
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

    case 'swagger':
      s.start('Adding Swagger/OpenAPI module...');
      try {
        await addSwaggerModule(projectDir, config);
        s.stop('Swagger documentation added successfully!');

        let integrationSnippet = '';
        if (config.framework === 'express') {
          integrationSnippet = `
${chalk.cyan('Add this to your src/index.ts:')}
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.config.js';
// ...
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));`;
        } else if (config.framework === 'hono') {
          integrationSnippet = `
${chalk.cyan('Add this to your src/index.ts:')}
import { setupSwagger } from './config/swagger.js';
// ...
setupSwagger(app);`;
        } else if (config.framework === 'fastify') {
          integrationSnippet = `
${chalk.cyan('Add this to your src/index.ts:')}
import { setupSwagger } from './config/swagger.js';
// ...
await setupSwagger(fastify);`;
        }

        outro(chalk.green(`
✓ Swagger module installed!

${chalk.cyan('Next steps:')}
1. Run ${chalk.yellow('npm install')} to install new dependencies
2. ${integrationSnippet}
3. Open ${chalk.yellow('http://localhost:port/docs')} to view your API docs
`));
      } catch (error) {
        s.stop('Failed to add Swagger module.');
        console.error(chalk.red(error));
        process.exit(1);
      }
      break;

    case 'test':
      try {
        await addTestModule(projectDir, config);
        
        outro(chalk.green(`
✓ Testing module installed!

${chalk.cyan('Next steps:')}
1. Run ${chalk.yellow('npm install')}
2. Generate tests: ${chalk.yellow('npx kodkod generate test <route-name>')}
3. Run tests: ${chalk.yellow('npm run test')}
`));
      } catch (error) {
        console.error(chalk.red(error));
        process.exit(1);
      }
      break;

    default:
      console.error(chalk.red(`Unknown module: ${module}`));
      console.log(chalk.yellow('Available modules: auth, swagger, test'));
      process.exit(1);
  }
}
