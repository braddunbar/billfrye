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

export const serveRequest = async (request: Request): Promise<Response> => {
  const response = await route(request)

  if (!response.headers.get("cache-control")) {
    response.headers.set("cache-control", "private,must-revalidate,max-age=0")
  }

  return response
}

export const serve = (options: { port?: number } = {}) => {
  options.port ??= 0
  console.log(options)
  const server = Deno.serve(options, serveRequest)

  return {
    port: server.addr.port,
    async [Symbol.asyncDispose]() {
      await server?.shutdown()
    },
  }
}

if (import.meta.main) {
  switch (Deno.args[0]) {
    case "build":
      await buildAssets()
      break

    case "dev":
      watchAssets()
      serve({ port: 4444 })
      break

    default:
      await readAssets()
      serve({ port: 4444 })
      break
  }
}
