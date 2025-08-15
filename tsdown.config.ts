import { defineConfig } from 'tsdown'
import pkg from './package.json' with { type: 'json' }

export default defineConfig({
  entry: ['./src'],
  dts: false,
  noExternal: [...Object.keys(pkg.dependencies)],
})
