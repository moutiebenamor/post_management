#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Poste Project Setup...\n');

const checks = [
  {
    name: 'Backend package.json exists',
    check: () => fs.existsSync('backend/package.json'),
    fix: 'Run: cd backend && npm init -y'
  },
  {
    name: 'Frontend package.json exists',
    check: () => fs.existsSync('frontend/package.json'),
    fix: 'Run: cd frontend && npm init -y'
  },
  {
    name: 'Backend .env file exists',
    check: () => fs.existsSync('backend/.env'),
    fix: 'Create backend/.env with MONGODB_URI, JWT_SECRET, etc.'
  },
  {
    name: 'Frontend .env file exists',
    check: () => fs.existsSync('frontend/.env'),
    fix: 'Create frontend/.env with REACT_APP_API_URL'
  },
  {
    name: 'Backend node_modules exists',
    check: () => fs.existsSync('backend/node_modules'),
    fix: 'Run: cd backend && npm install'
  },
  {
    name: 'Frontend node_modules exists',
    check: () => fs.existsSync('frontend/node_modules'),
    fix: 'Run: cd frontend && npm install'
  },
  {
    name: 'Backend app.js has module.exports',
    check: () => {
      try {
        const content = fs.readFileSync('backend/src/app.js', 'utf8');
        return content.includes('module.exports = app');
      } catch {
        return false;
      }
    },
    fix: 'Add "module.exports = app;" to backend/src/app.js'
  },
  {
    name: 'Frontend has ErrorBoundary component',
    check: () => fs.existsSync('frontend/src/components/ErrorBoundary.js'),
    fix: 'Create ErrorBoundary component in frontend/src/components/'
  },
  {
    name: 'Docker files exist',
    check: () => fs.existsSync('docker-compose.yml') && fs.existsSync('backend/Dockerfile'),
    fix: 'Create docker-compose.yml and Dockerfiles'
  },
  {
    name: 'Start scripts exist',
    check: () => fs.existsSync('start.bat') && fs.existsSync('start.sh'),
    fix: 'Create start.bat and start.sh scripts'
  }
];

let passed = 0;
let failed = 0;

checks.forEach((check, index) => {
  const result = check.check();
  const status = result ? '✅' : '❌';
  const message = result ? 'PASS' : 'FAIL';
  
  console.log(`${index + 1}. ${check.name}: ${status} ${message}`);
  
  if (!result) {
    console.log(`   Fix: ${check.fix}`);
    failed++;
  } else {
    passed++;
  }
});

console.log(`\n📊 Summary: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('🎉 All checks passed! Your project is ready to run.');
  console.log('\n🚀 To start the project:');
  console.log('   Windows: start.bat');
  console.log('   Unix/Mac: ./start.sh');
  console.log('   Manual: cd backend && npm run dev (then cd frontend && npm run dev)');
} else {
  console.log('⚠️  Some checks failed. Please fix the issues above.');
}

console.log('\n📚 Documentation:');
console.log('   API Docs: docs/api-spec.md');
console.log('   Roadmap: docs/roadmap.md');
console.log('   README: README.md');
