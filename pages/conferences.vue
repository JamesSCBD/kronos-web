<template>
  <div class="container-fluid">
    <div class="row ">
      <div class="col-12">
        <List type="conferences" :table-items="tableItems" :loading="loading" />
      </div>
    </div>
  </div>
</template>

<script>
import { readOnly } from '@roles'
import { List     } from '@components'
import { normalizeApiResponse } from '~/modules/api-normalize'

const apiHost = process.env.NUXT_ENV_API

export default {
  name      : 'Conferences',
  components: { List },
  auth      : readOnly,
  data      : () => ({ loading: false }),
  methods   : { tableItems }
}

function tableItems (ctx){
  // const searchParams = this.getSearchParams(ctx)

  this.loading = true

  return this.$http.$get(`${apiHost}/api/v2016/conferences`)
    .then(normalizeApiResponse)
  // .then(tabalizeData)
    .then((d) => {
      this.loading = false
      console.log(d)
      return d
    })
}

// function getSearchParams ({ filter, sortBy, sortDesc, perPage, currentPage }){
//   const q = JSON.stringify({  })
//   const queryParameters = { q }

//   return new URLSearchParams(queryParameters)
// }

// function tabalizeData (data){ return data.map(row => mapRow(row)) }

// const makeMeta      = ({ CreatedOn, CreatedBy, UpdatedOn, UpdatedBy }) => ({ CreatedOn, CreatedBy, UpdatedOn, UpdatedBy })

// function mapRow (row){
//   const { Code, Country, OrganizationName, OrganizationAcronym, MemberCount, EventCount } = row

//   return {
//     OrganizationName,
//     Country,
//     meta      : makeMeta(row),
//     identifier: `00000000${Code}`,
//     OrganizationAcronym,
//     MemberCount,
//     EventCount
//   }
// }
</script>
