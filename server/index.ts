// Temporary placeholder - This is now a frontend-only project
// The real application runs with Vite as a static frontend
import { spawn } from 'child_process';

console.log('Starting ATS Resume Checker - Frontend Only Mode');
console.log('Launching Vite development server...');

// Start Vite frontend server
const vite = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', '5000'], {
  stdio: 'inherit',
  cwd: process.cwd()
});

vite.on('error', (error) => {
  console.error('Failed to start Vite:', error);
  process.exit(1);
});

vite.on('close', (code) => {
  console.log(`Vite process exited with code ${code}`);
  process.exit(code || 0);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down...');
  vite.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('Shutting down...');
  vite.kill('SIGTERM');
});