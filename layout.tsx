import { assetUrl } from "./assets.ts"
import { render } from "preact-render-to-string"
import { VNode } from "preact"

export const layout = (view: VNode, name: string) => {
  return `<!doctype html>
<html>
<head>
  <meta charset='utf-8'>
  <script type="module" src="${assetUrl(name)}"></script>
</head>
<body>
  <div id="root">
    ${render(view)}
  </div>
</body>
</html>`
}
