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
    const selectedConferenceCode = this.$route.params.conferenceCode
    
    this.$store.dispatch('conferences/initialize', selectedConferenceCode)
    this.$store.dispatch('countries/initialize')
    this.$store.dispatch('organizations/initialize')
  }
}
</script>
