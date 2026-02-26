/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ILLUSTRATION_API: string
  readonly VITE_PRINTFUL_API: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
