/**
 * Utility to detect Angular project configuration
 * Run: npx ts-node detect-angular-config.ts
 */

import * as fs from 'fs';
import * as path from 'path';

interface AngularConfig {
  angularVersion: string | null;
  testingFramework: 'jasmine' | 'jest' | null;
  hasStandaloneComponents: boolean;
  hasSignals: boolean;
  hasControlFlow: boolean;
  projectStructure: 'modules' | 'standalone' | 'mixed' | null;
  typescript: {
    version: string | null;
    strict: boolean;
  };
}

export function detectAngularConfig(projectRoot = process.cwd()): AngularConfig {
  const packageJsonPath = path.join(projectRoot, 'package.json');
  const tsConfigPath = path.join(projectRoot, 'tsconfig.json');
  const angularJsonPath = path.join(projectRoot, 'angular.json');

  const config: AngularConfig = {
    angularVersion: null,
    testingFramework: null,
    hasStandaloneComponents: false,
    hasSignals: false,
    hasControlFlow: false,
    projectStructure: null,
    typescript: {
      version: null,
      strict: false
    }
  };

  // Read package.json
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(
      fs.readFileSync(packageJsonPath, 'utf-8')
    );

    // Detect Angular version
    const angularCore = packageJson.dependencies?.['@angular/core'] ||
                       packageJson.devDependencies?.['@angular/core'];
    if (angularCore) {
      config.angularVersion = angularCore.replace(/[\^~]/, '');
    }

    // Detect testing framework
    if (packageJson.devDependencies?.['jasmine'] ||
        packageJson.devDependencies?.['jasmine-core']) {
      config.testingFramework = 'jasmine';
    } else if (packageJson.devDependencies?.['jest']) {
      config.testingFramework = 'jest';
    }

    // Detect TypeScript version
    const tsVersion = packageJson.devDependencies?.['typescript'];
    if (tsVersion) {
      config.typescript.version = tsVersion.replace(/[\^~]/, '');
    }
  }

  // Read tsconfig.json
  if (fs.existsSync(tsConfigPath)) {
    const tsConfig = JSON.parse(
      fs.readFileSync(tsConfigPath, 'utf-8')
    );

    config.typescript.strict = tsConfig.compilerOptions?.strict ?? false;
  }

  // Read angular.json
  if (fs.existsSync(angularJsonPath)) {
    const angularJson = JSON.parse(
      fs.readFileSync(angularJsonPath, 'utf-8')
    );

    const projects = angularJson.projects || {};
    const projectNames = Object.keys(projects);

    // Detect project structure
    let standaloneCount = 0;
    let moduleCount = 0;

    for (const projectName of projectNames) {
      const project = projects[projectName];
      const projectConfig = project.projectType === 'application' ?
        project.architect?.build?.options :
        project.architect?.build?.options;

      if (projectConfig) {
        const mainFile = projectConfig.main || '';
        const mainContent = fs.existsSync(mainFile) ?
          fs.readFileSync(mainFile, 'utf-8') : '';

        if (mainContent.includes('bootstrapApplication')) {
          standaloneCount++;
          config.hasStandaloneComponents = true;
        } else if (mainContent.includes('bootstrapModule')) {
          moduleCount++;
        }
      }
    }

    config.projectStructure = standaloneCount > 0 && moduleCount === 0 ?
      'standalone' :
      moduleCount > 0 && standaloneCount === 0 ?
        'modules' :
        'mixed';
  }

  // Detect Signals and Control Flow support
  const angularVersionNum = config.angularVersion ?
    parseInt(config.angularVersion.split('.')[0]) : 0;

  config.hasSignals = angularVersionNum >= 16;
  config.hasControlFlow = angularVersionNum >= 17;

  return config;
}

// CLI usage
if (require.main === module) {
  const config = detectAngularConfig();
  console.log('📊 Angular Project Configuration:');
  console.log('================================');
  console.log(`Angular Version: ${config.angularVersion || 'Not detected'}`);
  console.log(`TypeScript: ${config.typescript.version || 'Not detected'} (Strict: ${config.typescript.strict})`);
  console.log(`Testing Framework: ${config.testingFramework || 'Not detected'}`);
  console.log(`Project Structure: ${config.projectStructure || 'Not detected'}`);
  console.log('\nFeatures:');
  console.log(`  ✓ Standalone Components: ${config.hasStandaloneComponents}`);
  console.log(`  ✓ Signals: ${config.hasSignals}`);
  console.log(`  ✓ Control Flow Syntax: ${config.hasControlFlow}`);
}

export default detectAngularConfig;
