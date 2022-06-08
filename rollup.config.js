import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'
import size from 'rollup-plugin-size'
import resolve from '@rollup/plugin-node-resolve'

export default {
  input: './src/index.ts',
  output: [
    { file: 'dist/recept.umd.js', format: 'umd', name: 'recept', sourcemap: true },
    { file: 'dist/recept.js', format: 'esm', sourcemap: true }
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
