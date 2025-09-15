import { index } from "./index.tsx"
import { serveDir } from "@std/http/file-server"

const BOOM = new URLPattern({ pathname: "/boom" })
const STATIC = new URLPattern({ pathname: "/static/*" })
const INDEX = new URLPattern({ pathname: "/" })

const routeRequest = async (request: Request): Promise<Response> => {
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

export class App {
  server?: Deno.HttpServer

  async serveRequest(request: Request): Promise<Response> {
    const response = await routeRequest(request)

    if (!response.headers.get("cache-control")) {
      response.headers.set("cache-control", "private,must-revalidate,max-age=0")
    }

    return response
  }

  serve(options: { port?: number } = {}) {
    options.port ??= 0
    this.server = Deno.serve(options, this.serveRequest.bind(this))
  }

  async [Symbol.asyncDispose]() {
    await this.server?.shutdown()
  }
}
