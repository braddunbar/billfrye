import { serveRequest } from "./main.ts"
import { assertEquals } from "@std/assert"

Deno.test("example", async () => {
  const url = new URL("https://example.com/not-found")
  const response = await serveRequest(new Request(url))
  assertEquals(response.status, 404)
})
