import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import eslint from 'rollup-plugin-eslint'
import replace from 'rollup-plugin-replace'

export default {
  entry: 'src/index.js',
  dest: 'dist/vue-smooth.min.js',
  format: 'cjs',
  plugins: [
    commonjs(),
    eslint({
      exclude: 'node_modules/**'
    }),
    babel({
      exclude: 'node_modules/**'
    }),
    replace({
      ENV: JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ]
}
