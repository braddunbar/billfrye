import { assetUrl } from "./assets.ts"
import { render } from "preact-render-to-string"
import { VNode } from "preact"

export const layout = (view: VNode, name: string) => {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'><text font-size='1' y='.9'>🎸</text/></svg>">
  <script type="module" src="${assetUrl(name)}"></script>
</head>
<body>
  <div id="root">
    ${render(view)}
  </div>
</body>
</html>`
}
