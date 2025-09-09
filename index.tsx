import { Index } from "./views/index.tsx"
import { layout } from "./layout.tsx"

export const index = (_request: Request) => {
  const html = layout(<Index />, "index")

  return new Response(html, {
    headers: {
      "content-type": "text/html",
    },
  })
}
