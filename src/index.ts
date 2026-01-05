#!/usr/bin/env node
import { cac } from 'cac';
import chalk from 'chalk';
import { intro, outro, text, select, isCancel, cancel } from '@clack/prompts';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { scaffoldProject } from './utils/scaffold.js';
import path from 'node:path';
import { spinner } from '@clack/prompts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf-8')
);
const { version } = packageJson;

const cli = cac('antstack');

const banner = `
 █████╗ ███╗   ██╗████████╗███████╗████████╗ █████╗  ██████╗██╗  ██╗
██╔══██╗████╗  ██║╚══██╔══╝██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
███████║██╔██╗ ██║   ██║   ███████╗   ██║   ███████║██║     █████╔╝ 
██╔══██║██║╚██╗██║   ██║   ╚════██║   ██║   ██╔══██║██║     ██╔═██╗ 
██║  ██║██║ ╚████║   ██║   ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
`;

cli
  .command('[root]', 'Initialize a new backend project')
  .option('--framework <framework>', 'Select framework (express, hono, fastify)')
  .option('--database <database>', 'Select database (postgresql, mongodb, mysql)')
  .option('--orm <orm>', 'Select ORM (prisma, drizzle)')
  .action(async (root, options) => {
    console.log(chalk.blue(banner));
    intro(`${chalk.bgBlue.white(' antstack-js ')} ${chalk.dim(`v${version}`)}`);

    let projectName = root || options.name;

    if (!projectName) {
      const name = await text({
        message: 'What is your project name?',
        placeholder: 'my-antstack-app',
        validate(value) {
          if (value.length === 0) return `Project name is required`;
        },
      });

      if (isCancel(name)) {
        cancel('Operation cancelled.');
        process.exit(0);
      }
      projectName = name;
    }

    let framework = options.framework;
    if (!framework) {
      framework = (await select({
        message: 'Select a framework',
        options: [
          { value: 'express', label: 'Express', hint: 'Classic, flexible' },
          { value: 'hono', label: 'Hono', hint: 'Ultrafast, modern' },
          { value: 'fastify', label: 'Fastify', hint: 'Performance-focused' },
        ],
      })) as string;

      if (isCancel(framework)) {
        cancel('Operation cancelled.');
        process.exit(0);
      }
    }

    let database = options.database;
    if (!database) {
      database = (await select({
        message: 'Select a database',
        options: [
          { value: 'postgresql', label: 'PostgreSQL', hint: 'Relational' },
          { value: 'mongodb', label: 'MongoDB', hint: 'NoSQL' },
          { value: 'mysql', label: 'MySQL', hint: 'Relational' },
        ],
      })) as string;

      if (isCancel(database)) {
        cancel('Operation cancelled.');
        process.exit(0);
      }
    }

    let orm = options.orm;
    if (!orm) {
      orm = (await select({
        message: 'Select an ORM',
        options: [
          { value: 'prisma', label: 'Prisma', hint: 'Typesafe, auto-generated client' },
          { value: 'drizzle', label: 'Drizzle', hint: 'Lightweight, SQL-like' },
        ],
      })) as string;

      if (isCancel(orm)) {
        cancel('Operation cancelled.');
        process.exit(0);
      }
    }

    const s = spinner();
    s.start('Scaffolding your project...');

    const targetDir = path.resolve(process.cwd(), projectName);
    
    try {
      await scaffoldProject(targetDir, {
        projectName,
        framework,
        database,
        orm,
      });
      s.stop(`Project ${projectName} scaffolded successfully!`);
      
      outro(
        chalk.green(
          `Done! Your new backend is ready at ${chalk.cyan(targetDir)}`
        )
      );
    } catch (error) {
      s.stop('Scaffolding failed.');
      console.error(chalk.red(error));
      process.exit(1);
    }
  });

cli
  .command('add <module>', 'Add a module to your project')
  .action(async (module) => {
    const { handleAddCommand } = await import('./commands/add.js');
    await handleAddCommand(module, process.cwd());
  });

cli
  .command('generate <type> <name>', 'Generate boilerplate (e.g., generate route products)')
  .alias('g')
  .action(async (type, name) => {
    const { handleGenerateCommand } = await import('./commands/generate.js');
    await handleGenerateCommand(type, name, process.cwd());
  });

cli.version(version);
cli.help();

try {
  cli.parse();
} catch (error) {
  console.error(chalk.red('\nAn error occurred:'));
  console.error(error);
  process.exit(1);
}
