<template>
  <div class="container-fluid">
    <div class="row ">
      <div class="col-12">
        <List :table-items="tableItems" :loading="loading" :total-rows="totalRows" />
      </div>
    </div>
  </div>
</template>

<script>
import { readOnly } from '@roles'
import   List       from '@components/list/ConferencesList'

export default {
  name      : 'Conferences',
  components: { List },
  auth      : readOnly,
  data      : () => ({ loading: false }),
  computed  : { totalRows: rows },
  methods   : { tableItems: search }
}

async function search (ctx){
  try {
    this.loading = true

    return await this.$kronosApi.getConferences()
  }
  finally {
    this.loading = false
  }
}

// ===================
// Get total number of rows
// ===================
function rows (){
  return 0
}
</script>
