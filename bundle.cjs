require('esbuild').build({
  entryPoints: ['index.js'],
  bundle: true,
  outfile: 'dist/minimized.js',
  minify: true,
  globalName: 'cloverleaf',
}).catch((err) => {
  console.log(err)
  process.exit(1)
})
