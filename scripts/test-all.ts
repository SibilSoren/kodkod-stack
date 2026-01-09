import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'node:path';
import chalk from 'chalk';

const TEST_DIR = path.resolve(process.cwd(), 'temp-test-projects');
const CLI_PATH = path.resolve(process.cwd(), 'dist/index.js');

const frameworks = ['express', 'hono', 'fastify'];
const runtimes = ['node', 'bun'];
const packageManagers = ['npm']; // Keeping it simple for the full matrix, can be expanded

// Valid DB/ORM combinations
const dbOrmCombos = [
  { database: 'mongodb', orm: 'mongoose' },
  { database: 'mongodb', orm: 'prisma' },
  { database: 'postgresql', orm: 'prisma' },
  { database: 'postgresql', orm: 'drizzle' },
  { database: 'mysql', orm: 'prisma' },
  { database: 'mysql', orm: 'drizzle' },
];

async function runCommand(cmd: string, args: string[], options: any = {}) {
  try {
    const { stdout } = await execa(cmd, args, { ...options });
    return stdout;
  } catch (error: any) {
    throw new Error(`Command failed: ${cmd} ${args.join(' ')}\n${error.stderr || error.message}`);
  }
}

async function registerRoute(projectDir: string, framework: string, name: string) {
  const routerPath = path.join(projectDir, 'src/api/router.ts');
  if (!(await fs.pathExists(routerPath))) return;

  const content = await fs.readFile(routerPath, 'utf-8');
  const importLine = `import ${name}Routes from './routes/${name}.routes.js';\n`;
  
  let newContent = importLine + content;
  
  if (framework === 'express') {
    newContent = newContent.replace('export { router };', `router.use('/${name}', ${name}Routes);\n\nexport { router };`);
  } else if (framework === 'hono') {
    newContent = newContent.replace('export { router };', `router.route('/${name}', ${name}Routes);\n\nexport { router };`);
  } else if (framework === 'fastify') {
    newContent = newContent.replace('}\n', `  await fastify.register(${name}Routes, { prefix: '/${name}' });\n}\n`);
  }

  await fs.writeFile(routerPath, newContent);
}

async function verifyFiles(projectDir: string, framework: string, orm: string) {
  const essentialFiles = [
    'package.json',
    'src/index.ts',
    '.env.example',
    'tsconfig.json',
  ];

  if (orm === 'prisma') {
    essentialFiles.push('prisma/schema.prisma');
  }

  for (const file of essentialFiles) {
    if (!(await fs.pathExists(path.join(projectDir, file)))) {
      throw new Error(`Missing essential file: ${file}`);
    }
  }
}

async function testCombination(framework: string, dbOrm: { database: string, orm: string }, runtime: string, pm: string, isDeep: boolean) {
  const projectName = `test-${framework}-${dbOrm.database}-${dbOrm.orm}-${runtime}`;
  const projectDir = path.join(TEST_DIR, projectName);

  console.log(chalk.blue(`\n🧪 Testing: ${framework} | ${dbOrm.database} | ${dbOrm.orm} | ${runtime}${isDeep ? ' [DEEP]' : ''}`));

  try {
    // 1. Scaffold
    await runCommand('node', [
      CLI_PATH,
      projectName,
      '--framework', framework,
      '--database', dbOrm.database,
      '--orm', dbOrm.orm,
      '--runtime', runtime,
      '--package-manager', pm
    ], { cwd: TEST_DIR });

    // 2. Verify Files
    await verifyFiles(projectDir, framework, dbOrm.orm);
    console.log(chalk.dim('  ✓ Files verified'));

    // 3. Test 'add' command
    await runCommand('node', [CLI_PATH, 'add', 'auth'], { cwd: projectDir });
    await runCommand('node', [CLI_PATH, 'add', 'swagger'], { cwd: projectDir });
    await runCommand('node', [CLI_PATH, 'add', 'test'], { cwd: projectDir });
    console.log(chalk.dim('  ✓ Modules added (auth, swagger, test)'));

    // 4. Test 'generate' command
    await runCommand('node', [CLI_PATH, 'generate', 'route', 'product'], { cwd: projectDir });
    await runCommand('node', [CLI_PATH, 'generate', 'test', 'product'], { cwd: projectDir });
    await registerRoute(projectDir, framework, 'product');
    console.log(chalk.dim('  ✓ Boilerplate generated and registered (route, test)'));

    // 5. Deep Verification (Install, Build, Test)
    if (isDeep) {
      console.log(chalk.yellow('  ⏳ Running deep verification (this may take a while)...'));
      
      const pmInstall = pm === 'npm' ? 'install' : 'install'; // Simplified
      const extraArgs = pm === 'npm' ? ['--legacy-peer-deps'] : [];
      await runCommand(pm, [pmInstall, ...extraArgs], { cwd: projectDir });
      console.log(chalk.dim('    ✓ Dependencies installed'));

      // Skip build if it's hono/fastify for now as we might need to setup the specific build script if it varies
      // But standard scaffold has 'build' and 'test'
      const pkg = await fs.readJson(path.join(projectDir, 'package.json'));
      
      if (pkg.scripts.build) {
        await runCommand(pm, ['run', 'build'], { cwd: projectDir });
        console.log(chalk.dim('    ✓ Build successful'));
      }

      if (pkg.scripts.test) {
        await runCommand(pm, ['run', 'test'], { cwd: projectDir });
        console.log(chalk.dim('    ✓ Tests passed'));
      }
    }

    console.log(chalk.green(`  ✅ Success!`));
    return { success: true, name: projectName };
  } catch (error: any) {
    console.error(chalk.red(`  ❌ Failed: ${projectName}`));
    console.error(chalk.dim(error.message));
    
    // Debug: Print package.json if it exists
    const pkgPath = path.join(projectDir, 'package.json');
    if (await fs.pathExists(pkgPath)) {
      console.log(chalk.yellow('\n--- package.json content ---'));
      console.log(await fs.readFile(pkgPath, 'utf-8'));
      console.log(chalk.yellow('----------------------------\n'));
    }
    
    return { success: false, name: projectName, error: error.message };
  }
}

async function main() {
  const isSubset = process.argv.includes('--subset');
  const isDeep = process.argv.includes('--deep');
  
  console.log(chalk.yellow(`\n🚀 Starting Comprehensive Test Suite ${isSubset ? '(Subset)' : '(Full Matrix)'}${isDeep ? ' [DEEP]' : ''}`));
  console.log(chalk.dim(`Test directory: ${TEST_DIR}\n`));

  await fs.ensureDir(TEST_DIR);
  await fs.emptyDir(TEST_DIR);

  // Build the CLI first
  console.log(chalk.yellow('Building CLI...'));
  await execa('npm', ['run', 'build']);

  const results = [];
  
  const combos = [];
  for (const framework of frameworks) {
    for (const dbOrm of dbOrmCombos) {
      for (const runtime of runtimes) {
        combos.push({ framework, dbOrm, runtime, pm: 'npm' });
      }
    }
  }

  const testCombos = isSubset ? combos.filter((_, i) => i % 6 === 0) : combos;

  for (const combo of testCombos) {
    const result = await testCombination(combo.framework, combo.dbOrm, combo.runtime, combo.pm, isDeep);
    results.push(result);
  }

  console.log(chalk.yellow('\n📊 Test Results Summary:'));
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(chalk.green(`  Passed: ${successful}`));
  if (failed > 0) {
    console.log(chalk.red(`  Failed: ${failed}`));
    results.filter(r => !r.success).forEach(r => {
      console.log(chalk.red(`    - ${r.name}`));
    });
    process.exit(1);
  } else {
    console.log(chalk.green('\n✨ All tests passed! ✨'));
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
