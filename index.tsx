import { render } from "preact-render-to-string"

export const index = (_request: Request) => {
  const html = render(
    <h1>Bill Frye!</h1>,
  )

  return new Response(html, {
    headers: {
      "content-type": "text/html",
    },
  })
}
