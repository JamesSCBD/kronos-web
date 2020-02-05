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
import   List       from '@components/list/OrganizationsList'

export default {
  name      : 'Organizations',
  components: { List },
  data      : initData,
  methods   : { tableItems: search },
  auth      : readOnly
}

// ===================
//
// ===================
function initData (){
  return {
    loading: false
  }
}

// ===================
//
// ===================
async function search (ctx){
  try {
    this.loading = true

    const query =  buildQuery(ctx)

    const rows = await this.$kronosApi.getOrganizations(query)

    return rows.map(r => ({ ...r, identifier: r.OrganizationUID }))
  } // TODO Handle error
  finally {
    this.loading = false
  }
}

// ===================
// Build Query to pass to kronos api
// ===================
function buildQuery ({ filter, sortBy, sortDesc, perPage, currentPage }){
  // TODO:

  // apply List standard paramters: filter, sortBy, sortDesc, perPage, currentPage
  // and contact search filter to KronosQuery

  const query = {
    limit   : perPage || 20,
    FreeText: 'secretariat biodiversity SCBD'
  }

  return query
}

</script>
