<template>
  <CFooter>
    <!-- <div>
      some thin here left aligned by default
    </div> -->
    <div class="ml-auto">
      <a href="https://www.cbd.int" target="_blank">SCBD</a>
      <span class="ml-1">&copy; {{ currentYear }}</span>
    </div>
  </CFooter>
</template>

<script>
import { CFooter } from '@coreui/vue'

export default {
  name      : 'KFooter',
  components: { CFooter },
  computed  : { currentYear }
}

function currentYear (){ return (new Date()).getFullYear() }
</script>
