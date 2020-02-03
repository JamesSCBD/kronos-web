<template>
  <div class="container-fluid">
    <div class="row ">
      <div class="col-12">
        <List :table-items="tableItems" :loading="loading" />
      </div>
    </div>
  </div>
</template>

<script>
import { readOnly } from '@roles'
import   List       from '@components/list/ConferencesList'

const apiHost = process.env.NUXT_ENV_API

export default {
  name      : 'Conferences',
  components: { List },
  auth      : readOnly,
  data      : () => ({ loading: false }),
  methods   : { tableItems }
}

function tableItems (ctx){
  this.loading = true

  return this.$http.$get(`${apiHost}/api/v2016/conferences`)
    .then((d) => {
      this.loading = false
      return d
    })
}
</script>
