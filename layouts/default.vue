<template>
  <div class="c-app">
    <KSidebar />
    <div class="c-wrapper">
      <KHeader />
      <div class="c-body">
        <main class="c-main">
          <div class="container-fluid">
            <nuxt />
          </div>
        </main>
      </div>
      <KFooter />
    </div>
  </div>
</template>

<script>
import   mixin                        from './mixin'
import { KHeader, KFooter, KSidebar } from '~/components/kronos'

export default {
  name      : 'Default',
  components: { KHeader, KFooter, KSidebar },
  mixins    : [ mixin ],
  created (){
    this.$store.dispatch('conferences/getDataFromApi')
    this.$store.dispatch('countries/getDataFromApi')
    this.$store.dispatch('organizations/getDataFromApi')
  }
}
</script>
