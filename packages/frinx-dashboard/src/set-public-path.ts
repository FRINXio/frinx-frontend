// its necesary in order to change path to the static files on the fly (e.g. {url_basename}/static/[id].bundle.js ...)
// https://webpack.js.org/guides/public-path/
__webpack_public_path__ = `${window.__CONFIG__.url_basename}/`.replace(/(\/)\/+/g, '$1');
