export default { mounted, created }

function mounted (){
  window.document.addEventListener('$me', () => {
    this.$root.$emit('$me', this.$me)
    updateChildren(this)
    this.$store.dispatch('countries/getDataFromApi')
  })
}

function updateChildren (vueComp){
  const { $children } = vueComp

  vueComp.$forceUpdate()
  for (const childComp of $children)
    updateChildren(childComp)
}

function created (){
  this.$store.dispatch('conferences/getDataFromApi')
}
