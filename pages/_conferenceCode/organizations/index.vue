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
  data      : () => ({ loading: false }),
  methods   : { tableItems: search },
  auth      : readOnly
}

//= ===================
//
//= ===================
async function search (ctx){
  try {
    this.loading = true

    const query =  buildQuery(ctx)

    let rows = await this.$kronosApi.queryOrganizations(query)

    rows = rows.map(mapRow)

    return rows
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

  // apply Boostrap standard paramters: filter, sortBy, sortDesc, perPage, currentPage
  // and contact search filter to KronosQuery

  const query = { limit: perPage || 100 }

  return query
}

// ===================
//
// ===================
function toMeta  ({ CreatedOn, CreatedBy, UpdatedOn, UpdatedBy }){ return { CreatedOn, CreatedBy, UpdatedOn, UpdatedBy } }

function mapRow (row){
  const { OrganizationUID, Country, OrganizationName, OrganizationAcronym, MemberCount, EventCount } = row

  return {
    OrganizationName,
    Country,
    meta      : toMeta(row),
    identifier: OrganizationUID,
    OrganizationAcronym,
    MemberCount,
    EventCount
  }
}
</script>
