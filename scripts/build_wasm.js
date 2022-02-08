const { execSync } = require("child_process");

const commands = [
  "cd src/common/wasm && wasm-pack build --target web",
  "mkdir -p dist/public/build",
  "cp src/common/wasm/pkg/web_tail_wasm_bg.wasm dist/public/build/web_tail_wasm_bg.wasm",
];

commands.forEach((command) => {
  console.log(`execute command: ${command}`);
  execSync(command, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
});
