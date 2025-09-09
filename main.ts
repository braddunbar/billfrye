import { index } from "./index.tsx"
import { serveDir } from "@std/http/file-server"
import { buildAssets, readAssets, watchAssets } from "./assets.ts"

const BOOM = new URLPattern({ pathname: "/boom" })
const STATIC = new URLPattern({ pathname: "/static/*" })

const serve = () => {
  Deno.serve({ port: 4444 }, (request) => {
    if (STATIC.exec(request.url)) {
      return serveDir(request, {
        fsRoot: "static",
        urlRoot: "static",
      })
    }

    const match = BOOM.exec(request.url)

    if (match) {
      return new Response("boom!")
    }

    return index(request)
  })
}

switch (Deno.args[0]) {
  case "build":
    await buildAssets()
    break

  case "dev":
    watchAssets()
    serve()
    break

  default:
    await readAssets()
    serve()
    break
}
