<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <List :table-items="tableItems" :loading="loading" :total-rows="totalRows" />
      </div>
    </div>
  </div>
</template>

<script>
import { readOnly } from '@roles'
import List from '@components/list/OrganizationsList'

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
    loading  : false,
    totalRows: 0
  }
}

// ===================
//
// ===================
async function search (ctx){
  try {
    this.loading = true

    const query = buildQuery(ctx)

    const rows = await this.$kronosApi.getOrganizations(query)

    this.totalRows = getTotalRows(ctx, this, rows.length)
    return rows.map(r => ({ ...r, identifier: r.OrganizationUID }))
  }
  finally {
    // TODO Handle error
    this.loading = false
  }
}

// ===================
// Get total number of rows
// ===================
function getTotalRows (ctx, _this, _rowsLength){
  if (_rowsLength < ctx.perPage) return ctx.perPage * ctx.currentPage
  else return ctx.perPage * ctx.currentPage + 1
}

// ===================
// Build Query to pass to kronos api
// ===================
function buildQuery ({ filter, sortBy, sortDesc, perPage, currentPage }){
  // TODO:

  // apply List standard paramters: filter, sortBy, sortDesc, perPage, currentPage
  // and contact search filter to KronosQuery

  const query = {
    limit: 20
    //FreeText: ''
  }

  return query
}
</script>
