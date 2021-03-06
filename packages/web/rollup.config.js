require = require('esm')(module)
import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import builtins__plugin from 'rollup-plugin-node-builtins'
import globals__plugin from 'rollup-plugin-node-globals'
import commonjs from 'rollup-plugin-commonjs'
import svelte from 'rollup-plugin-svelte'
import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'
const { clone } = require('@ctx-core/object')
const { reject } = require('@ctx-core/array')
const { style } = require('@ctx-core/sass/svelte')
import config from 'sapper/config/rollup'
import pkg from './package.json'
const mode = process.env.NODE_ENV
const dev = mode === 'development'
const legacy = !!process.env.SAPPER_LEGACY_BUILD
const __replace = {
	'process.env.NODE_ENV': JSON.stringify(mode),
	'process.env.ROOT__PATH': JSON.stringify('/'),
}
export default {
	client: {
		input: config.client.input(),
		output: config.client.output(),
		plugins: [
			replace__({
				'process.browser': true,
			}),
			svelte({
				dev,
				hydratable: true,
				emitCss: true,
				preprocess: {
					style,
				},
			}),
			globals__plugin(),
			builtins__plugin(),
			resolve(),
			commonjs(),
			legacy && babel({
				extensions: ['.js', '.mjs', '.html', '.svelte'],
				runtimeHelpers: true,
				exclude: ['node_modules/@babel/**'],
				presets: [
					['@babel/preset-env', {
						targets: '> 0.25%, not dead'
					}]
				],
				plugins: [
					'@babel/plugin-syntax-dynamic-import',
					['@babel/plugin-transform-runtime', {
						useESModules: true
					}]
				]
			}),
			!dev && terser({
				module: true
			})
		],
	},
	server: {
		input: config.server.input(),
		output: config.server.output(),
		plugins: [
			replace__({
				'process.browser': false,
			}),
			svelte({
				generate: 'ssr',
				dev,
				preprocess: {
					style,
				},
			}),
			resolve(),
			commonjs()
		],
		external: reject(
			Object.keys(pkg.dependencies),
			path => /(@edgar-explorer|@ctx-core|@sapper)\/.*/.test(path)
		).concat(
			require('module').builtinModules || Object.keys(process.binding('natives'))
		),
	},
	serviceworker: {
		input: config.serviceworker.input(),
		output: config.serviceworker.output(),
		plugins: [
			resolve(),
			replace__({
				'process.browser': true,
			}),
			commonjs(),
			!dev && terser()
		]
	}
}
function replace__(params) {
	return replace(clone(__replace, params))
}
