import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSync } from 'esbuild';
const web = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const destination = path.join(web, 'public/course-runtime');
fs.mkdirSync(destination, { recursive: true });
buildSync({
  stdin: {
    contents:
      'import * as React from "react"; import { createRoot } from "react-dom/client"; window.FDEReact = React; window.FDEMount = Component => createRoot(document.getElementById("root")).render(React.createElement(Component));',
    resolveDir: web,
    sourcefile: 'course-react-runtime.js',
  },
  bundle: true,
  platform: 'browser',
  format: 'iife',
  target: 'es2022',
  minify: true,
  define: { 'process.env.NODE_ENV': '"production"' },
  outfile: path.join(destination, 'react.js'),
});
console.log('Packaged the real React exercise runtime.');
