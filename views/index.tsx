import { render } from "preact"

export function Index() {
  return (
    <>
      <h1>Bill Frye!</h1>
      <button type="button" onClick={() => alert("👋")}>Click me</button>
    </>
  )
}

if (typeof document !== "undefined") {
  const root = document.getElementById("root")
  if (root) render(<Index />, root)
}
