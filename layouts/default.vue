<template>
  <div class="c-app">
    <KSidebar />
    <div class="c-wrapper">
      <KHeader />
      <div class="c-body">
        <main class="c-main">
          <nuxt />
        </main>
      </div>
      <KFooter />
    </div>
  </div>
</template>

<script>
import mixin from './mixin';
import { KHeader, KFooter, KSidebar } from '~/components/kronos';

export default {
  name      : 'Default',
  components: { KHeader, KFooter, KSidebar },
  mixins    : [ mixin ],
  created() {
    const selectedConferenceCode = this.$route.params.conferenceCode;

    this.$store.dispatch('conferences/initialize', selectedConferenceCode);
    this.$store.dispatch('countries/initialize');
    this.$store.dispatch('organizations/initialize');
  },
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
