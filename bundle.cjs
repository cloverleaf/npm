require('esbuild').build({
  entryPoints: ['index.js'],
  bundle: true,
  outfile: 'dist/minimized.js',
  minify: true,
}).catch(() => process.exit(1))
