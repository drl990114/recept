export default {
  port: '8000',
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    target: 'esnext',
    format: 'esm'
  },
  server: {
    port: 3000
  }
}
