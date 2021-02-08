
export default {
  bind (el, binding) {
    // 需求，就是将msg的值，赋值给当前元素的innerText属性

    // msg的值： binding.value
    // 当前元素： el
    el.innerHTML = binding.value
  },
  update (el, binding) {
    el.innerHTML = binding.value
  }
}
