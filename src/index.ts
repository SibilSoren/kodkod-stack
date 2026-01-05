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
${chalk.green(`
 █████╗ ███╗   ██╗████████╗███████╗████████╗ █████╗  ██████╗██╗  ██╗
██╔══██╗████╗  ██║╚══██╔══╝██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
███████║██╔██╗ ██║   ██║   ███████╗   ██║   ███████║██║     █████╔╝ 
██╔══██║██║╚██╗██║   ██║   ╚════██║   ██║   ██╔══██║██║     ██╔═██╗ 
██║  ██║██║ ╚████║   ██║   ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝`)}
${chalk.dim('─────────────────────────────────────────────────────────────────────')}
${chalk.cyan('         Roll Your Own Backend Stack • Own Every Line of Code')}
`;

cli
  .command('[root]', 'Initialize a new backend project')
  .option('--framework <framework>', 'Select framework (express, hono, fastify)')
  .option('--database <database>', 'Select database (postgresql, mongodb, mysql)')
  .option('--orm <orm>', 'Select ORM (prisma, drizzle, mongoose)')
  .option('--runtime <runtime>', 'Select runtime (node, bun)')
  .option('--package-manager <pm>', 'Select package manager (npm, pnpm, yarn, bun)')
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
      // Different ORM options based on database
      const ormOptions = database === 'mongodb'
        ? [
            { value: 'mongoose', label: 'Mongoose', hint: 'MongoDB-native ODM' },
            { value: 'prisma', label: 'Prisma', hint: 'Typesafe, auto-generated client' },
          ]
        : [
            { value: 'prisma', label: 'Prisma', hint: 'Typesafe, auto-generated client' },
            { value: 'drizzle', label: 'Drizzle', hint: 'Lightweight, SQL-like' },
          ];

      orm = (await select({
        message: 'Select an ORM',
        options: ormOptions,
      })) as string;

      if (isCancel(orm)) {
        cancel('Operation cancelled.');
        process.exit(0);
      }
    }

    let runtime = options.runtime;
    if (!runtime) {
      runtime = (await select({
        message: 'Select a runtime',
        options: [
          { value: 'node', label: 'Node.js', hint: 'Standard' },
          { value: 'bun', label: 'Bun', hint: 'Fast, all-in-one' },
        ],
      })) as string;

      if (isCancel(runtime)) {
        cancel('Operation cancelled.');
        process.exit(0);
      }
    }

    let packageManager = options.packageManager;
    if (!packageManager) {
      const pmOptions = runtime === 'bun' 
        ? [
            { value: 'bun', label: 'Bun', hint: 'Default for Bun' },
            { value: 'npm', label: 'npm', hint: 'Standard' },
            { value: 'pnpm', label: 'pnpm', hint: 'Fast, space efficient' },
          ]
        : [
            { value: 'npm', label: 'npm', hint: 'Standard' },
            { value: 'pnpm', label: 'pnpm', hint: 'Fast, space efficient' },
            { value: 'yarn', label: 'Yarn', hint: 'Classic' },
          ];

      packageManager = (await select({
        message: 'Select a package manager',
        options: pmOptions,
      })) as string;

      if (isCancel(packageManager)) {
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
        runtime,
        packageManager,
      });
      s.stop(`Project ${projectName} scaffolded successfully!`);
      
      const installCmd = packageManager === 'npm' ? 'npm install' : `${packageManager} install`;
      const devCmd = packageManager === 'bun' ? 'bun dev' : `${packageManager} run dev`;

      outro(
        chalk.green(`
Done! Your new backend is ready at ${chalk.cyan(targetDir)}

${chalk.white('Next steps:')}
  ${chalk.dim('1.')} cd ${projectName}
  ${chalk.dim('2.')} ${installCmd}
  ${chalk.dim('3.')} ${devCmd}
        `)
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
