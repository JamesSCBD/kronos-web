<template>
  <section>
    <div v-if="!$ssoScbd.me.isAuthenticated" class="col-md-12">
      <div class="card p-4">
        <div class="card-body text-center">
          <h1>Authenticating</h1>
          <fa :icon="['fas','circle-notch']" class="fa-spin fa-3x fa-fw" />
        </div>
      </div>
    </div>
    <div v-if="$ssoScbd.me.isAuthenticated" class="c-app">
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
  </section>
</template>

<script>

import { KHeader, KFooter, KSidebar } from '~/components/kronos';

export default {
  name      : 'Default',
  components: { KHeader, KFooter, KSidebar },
  async created() { // eslint-disable-line 
    const { isAuthenticated } = await this.$getUser();

    if (!isAuthenticated) return this.$router.push({ path: '/login' });

    this.$store.dispatch('conferences/initialize');
    this.$store.dispatch('countries/initialize');
    this.$store.dispatch('organizations/initialize');
  },
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
