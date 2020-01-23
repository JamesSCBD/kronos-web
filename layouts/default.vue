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
import { KHeader, KFooter, KSidebar } from '~/components'

export default {
  name      : 'Default',
  components: { KHeader, KFooter, KSidebar },
  mixins    : [ mixin ]
}
</script>
