import { index } from "./index.tsx"
import { serveDir } from "@std/http/file-server"
import { buildAssets, readAssets, watchAssets } from "./assets.ts"

const BOOM = new URLPattern({ pathname: "/boom" })
const STATIC = new URLPattern({ pathname: "/static/*" })
const INDEX = new URLPattern({ pathname: "/" })

const route = async (request: Request): Promise<Response> => {
  if (STATIC.exec(request.url)) {
    return await serveDir(request, {
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

  if (INDEX.exec(request.url)) {
    return index(request)
  }

  return new Response("404", { status: 404 })
}

const serve = () => {
  Deno.serve({ port: 4444 }, async (request) => {
    const response = await route(request)

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
