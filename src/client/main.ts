import App from "./App.svelte";
import init from "web-tail-wasm";

const load = async () => {
  const startTime = performance.now();
  await init();
  const endTime = performance.now();
  console.log(`Call to wasm init took ${endTime - startTime} milliseconds`);

  const app = new App({
    target: document.body,
    props: {},
  });
};

load();

// export default app;
