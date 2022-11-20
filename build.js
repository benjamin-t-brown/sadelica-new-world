require('child_process').spawn('make', {
  cwd: process.cwd(),
  detached: false,
  stdio: 'inherit',
});
