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
import List from '@components/list/ContactsList'

export default {
  name      : 'Contacts',
  components: { List },
  data      : initData,
  computed  : { totalRows: rows },
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

//= ===================
//
//= ===================
async function search (ctx){
  try {
    this.loading = true
    const query = buildQuery(ctx)
    const rows = await this.$kronosApi.getContacts(query)

    return rows.map(r => ({ ...r, identifier: r.ContactUID }))
  }
  finally {
    // TODO Handle error
    this.loading = false
  }
}

// ===================
// Build Query to pass to kronos api
// ===================
function buildQuery ({ filter, sortBy, sortDesc, perPage, currentPage }){
  // TODO:

  // apply Boostrap standard paramters: filter, sortBy, sortDesc, perPage, currentPage
  // and contact search filter to KronosQuery
  const skipRecord = currentPage > 0 ? (currentPage - 1) * perPage : 0
  const query = {
    limit   : perPage || 25,
    skip    : skipRecord,
    FreeText: 'stephane bilodeau'
    // Need API param for sorting(shortBy,direction)
  }

  return query
}

// ===================
// Get total number of rows
// ===================
function rows (){
  return 650 // Need API for total count of contacts
}
</script>
