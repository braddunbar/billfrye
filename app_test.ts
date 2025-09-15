import { App } from "./app.ts"
import { assertEquals } from "@std/assert"

Deno.test("example", async () => {
  const app = new App()
  const url = new URL("https://example.com/not-found")
  const response = await app.serveRequest(new Request(url))
  assertEquals(response.status, 404)
  assertEquals(await response.text(), "404")
})
