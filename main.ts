Deno.serve({ port: 4444 }, (request): Response => {
  return new Response("Bill Frye")
})
