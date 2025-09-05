const BOOM = new URLPattern({ pathname: '/boom' })

Deno.serve({ port: 4444 }, (request): Response => {

  const match = BOOM.exec(request.url)

  if (match) {
    return new Response("boom")
  }

  return new Response("Bill Frye!")
})
