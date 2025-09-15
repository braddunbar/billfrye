import { App } from "./app.ts"
import { buildAssets, readAssets, watchAssets } from "./assets.ts"

if (import.meta.main) {
  switch (Deno.args[0]) {
    case "build":
      await buildAssets()
      break

    case "dev":
      watchAssets()
      new App().serve({ port: 4444 })
      break

    default:
      await readAssets()
      new App().serve({ port: 4444 })
      break
  }
}
