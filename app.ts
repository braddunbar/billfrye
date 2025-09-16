import { index } from "./index.tsx"
import { serveDir } from "@std/http/file-server"
// @ts-types="npm:@types/pg"
import { Pool, PoolClient } from "pg"

const DATABASE_URL = Deno.env.get("DATABASE_URL") ??
  "postgresql://localhost/billfrye"
const DATABASE_SSL = Deno.env.get("DATABASE_SSL") === "true"
const ca = await Deno.readTextFile("./ca-certificate.crt")
const BOOM = new URLPattern({ pathname: "/boom" })
const STATIC = new URLPattern({ pathname: "/static/*" })
const INDEX = new URLPattern({ pathname: "/" })

const routeRequest = async ({ db, request }: Context): Promise<Response> => {
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
    const res = await db.query<{ message: string }>(
      "SELECT $1::text as message",
      ["Hello world!"],
    )
    return new Response(`boom - ${res.rows[0].message}`)
  }

  if (INDEX.exec(request.url)) {
    return index(request)
  }

  return new Response("404", { status: 404 })
}

type Context = {
  db: PoolClient
  request: Request
}

export class App {
  pool: Pool
  server?: Deno.HttpServer

  constructor() {
    this.pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: DATABASE_SSL ? { ca } : undefined,
    })
  }

  async serveRequest(request: Request): Promise<Response> {
    const db = await this.pool.connect()
    const context = { db, request }
    try {
      const response = await routeRequest(context)

      if (!response.headers.get("cache-control")) {
        response.headers.set(
          "cache-control",
          "private,must-revalidate,max-age=0",
        )
      }

      return response
    } finally {
      db.release()
    }
  }

  serve(options: { port?: number } = {}) {
    options.port ??= 0
    this.server = Deno.serve(options, this.serveRequest.bind(this))
  }

  async [Symbol.asyncDispose]() {
    await Promise.all([
      this.server?.shutdown(),
      this.pool.end(),
    ])
  }
}
