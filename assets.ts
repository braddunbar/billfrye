import { InputOptions, OutputOptions, rolldown, watch } from "rolldown"
import denoPlugin from "@deno/rolldown-plugin"

const BASE = Deno.env.get("ASSETS_BASE") || "/static"

type Manifest = {
  files: Record<string, string>
}

export let manifest: Manifest = {
  files: {},
}

export const assetUrl = (name: string): string | undefined => {
  return `${BASE}/js/${manifest.files[name]}`
}

const inputOptions: InputOptions = {
  platform: "browser",
  input: "./views/index.tsx",
  jsx: {
    importSource: "preact",
    jsxImportSource: "preact",
    mode: "automatic",
  },
  plugins: [
    denoPlugin(),
    {
      name: "manifest",
      async generateBundle(_options, bundle) {
        const files: Record<string, string> = {}
        for (const [path, { name }] of Object.entries(bundle)) {
          if (name) files[name] = path
        }
        manifest = { files }
        await Deno.writeTextFile("./manifest.json", JSON.stringify(manifest))
      },
    },
  ],
}

const outputOptions: OutputOptions = {
  dir: "static/js",
  format: "esm",
  entryFileNames: "[name]-[hash].js",
  sourcemap: true,
}

export const readAssets = async () => {
  manifest = JSON.parse(await Deno.readTextFile("./manifest.json"))
}

export const buildAssets = async () => {
  const bundle = await rolldown(inputOptions)
  await bundle.write({
    ...outputOptions,
    minify: true,
  })
}

export const watchAssets = () => {
  const watcher = watch({ ...inputOptions, output: outputOptions })

  watcher.on("event", (event) => {
    if (event.code === "ERROR") {
      console.log(event.error)
    } else if (event.code === "BUNDLE_END") {
      event.result
    }
  })
}
