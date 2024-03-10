require('esbuild').build({
  entryPoints: ['index.js'],
  bundle: true,
  outfile: 'dist/minimized.js',
  format: "esm",
  minify: true,
}).catch((err) => {
  console.log(err)
  process.exit(1)
})
