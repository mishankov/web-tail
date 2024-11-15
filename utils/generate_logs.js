const fs = require("fs");

async function run() {
  while (true) {
    await new Promise((r) => setTimeout(r, 1000));

    let logLine = `[${new Date()}] [MyApp] [INFO] - ${Math.random()}\n`;

    console.log(logLine);

    fs.writeFile("dist/myfile.log", logLine, { flag: "a+" }, (err) => {});
  }
}

run();
