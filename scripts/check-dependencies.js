#!/usr/bin/env node

/**
 * Check for outdated dependencies and security vulnerabilities
 */

const { exec } = require('child_process');
const chalk = require('chalk');

console.log(chalk.blue('🔍 Checking dependencies...\n'));

// Check for outdated packages
const checkOutdated = () => {
  return new Promise((resolve) => {
    exec('npm outdated --json', (error, stdout) => {
      if (stdout) {
        const outdated = JSON.parse(stdout);
        const count = Object.keys(outdated).length;
        
        if (count > 0) {
          console.log(chalk.yellow(`⚠️  Found ${count} outdated packages:\n`));
          
          Object.entries(outdated).forEach(([name, info]) => {
            console.log(
              `  ${name}: ${chalk.red(info.current)} → ${chalk.green(info.wanted)} (latest: ${chalk.blue(info.latest)})`
            );
          });
          
          console.log('\n  Run "npm update" to update to wanted versions');
          console.log('  Run "npm install <package>@latest" to update to latest\n');
        } else {
          console.log(chalk.green('✅ All packages are up to date!\n'));
        }
      }
      resolve();
    });
  });
};

// Check for security vulnerabilities
const checkSecurity = () => {
  return new Promise((resolve) => {
    exec('npm audit --json', (error, stdout) => {
      if (stdout) {
        const audit = JSON.parse(stdout);
        const { vulnerabilities } = audit.metadata;
        
        if (vulnerabilities && Object.values(vulnerabilities).some(v => v > 0)) {
          console.log(chalk.red('🚨 Security vulnerabilities found:\n'));
          
          Object.entries(vulnerabilities).forEach(([severity, count]) => {
            if (count > 0) {
              const color = severity === 'critical' || severity === 'high' ? 'red' : 'yellow';
              console.log(`  ${chalk[color](`${severity}: ${count}`)}`);
            }
          });
          
          console.log('\n  Run "npm audit fix" to fix vulnerabilities');
          console.log('  Run "npm audit" for more details\n');
        } else {
          console.log(chalk.green('✅ No security vulnerabilities found!\n'));
        }
      }
      resolve();
    });
  });
};

// Check bundle size
const checkBundleSize = () => {
  console.log(chalk.blue('📦 Checking bundle size...\n'));
  
  // This would require more complex analysis with metro-bundle-size-analyzer
  console.log(chalk.gray('  Bundle size analysis requires building the app'));
  console.log(chalk.gray('  Run "npx expo export:web" then analyze the output\n'));
};

// Run all checks
const runChecks = async () => {
  await checkOutdated();
  await checkSecurity();
  checkBundleSize();
  
  console.log(chalk.blue('✨ Dependency check complete!\n'));
};

runChecks().catch(console.error);