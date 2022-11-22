require('child_process').spawn('make', {
  cwd: __dirname + '/../cpp',
  detached: false,
  stdio: 'inherit',
});
