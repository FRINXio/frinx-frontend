// its necessary in order to change path to the static files on the fly (e.g. {URLBasename}/static/[id].bundle.js ...)
// https://webpack.js.org/guides/public-path/

export function setWebpackPublicPath(): void {
  if (process.env.NODE_ENV === 'production') {
    __webpack_public_path__ = `${window.__CONFIG__.URLBasename}/`.replace(/(\/)\/+/g, '$1');
  }
}
