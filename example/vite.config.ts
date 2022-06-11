export default {
  port: '8000',
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    target: 'esnext',
    format: 'esm',
    jsxInject: `import {h,Fragment} from 'recept'`
  },
  server: {
    port: 3000
  }
}
