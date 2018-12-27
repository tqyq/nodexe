const { exec } = require('child_process');
exec('ls', (err, stdout, stderr) => {
  if (err) {
    console.log(`err: ${err}`);
    return;
  }

  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});