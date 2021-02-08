import html from './html'

const install = function (Vue) {
  Vue.directive('pHtml', html)
}

if (window.Vue) {
  window['phtml'] = html
  Vue.use(install); // eslint-disable-line
}

html.install = install
export default html
