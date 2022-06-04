import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'
import size from 'rollup-plugin-size'
import resolve from '@rollup/plugin-node-resolve'

export default {
  input: './src/index.ts',
  output: [
    { file: 'dist/sreact.umd.js', format: 'umd', name: 'sreact', sourcemap: true },
    { file: 'dist/sreact.js', format: 'esm', sourcemap: true }
  ],
  plugins: [
    typescript({
      tsconfig: 'tsconfig.json',
      removeComments: true,
      useTsconfigDeclarationDir: true
    }),
    resolve(),
    terser(),
    size()
  ]
}
