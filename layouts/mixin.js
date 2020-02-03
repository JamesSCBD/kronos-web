export default { mounted }

function mounted (){
  window.document.addEventListener('$me', () => {
    this.$root.$emit('$me', this.$me)
    updateChildren(this)
  })
}

function updateChildren (vueComp){
  const { $children } = vueComp

  vueComp.$forceUpdate()

  for (const childComp of $children)
    updateChildren(childComp)
}
