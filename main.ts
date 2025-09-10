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
        headers: [
          "cache-control: max-age=315360000",
        ],
        urlRoot: "static",
      })
    }

    const match = BOOM.exec(request.url)

    if (match) {
      return new Response("boom!")
    }

    const response = index(request)

    if (!response.headers.get("cache-control")) {
      response.headers.set("cache-control", "private,must-revalidate,max-age=0")
    }

    return response
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
