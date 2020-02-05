<template>
  <BTable

    id="KContactsList"
    :items="tableItems"
    :fields="columns"
    :busy="loading"
    class="mb-0 table-outline list"
    responsive="md"
    hover
    head-variant="light"
    sort-icon-left
  >
    <!-- https://bootstrap-vue.js.org/docs/components/table#scoped-field-slots -->

    <template v-slot:table-busy>
      <div class="text-center text-danger my-2">
        <CIcon name="circleNotch" class="fa-spin fa-3x fa-fw" />
        <strong>Loading...</strong>
      </div>
    </template>

    <template v-slot:cell(Country)="{value}">
      <CountryCol v-if="value" :code="value" />
    </template>

    <template v-slot:cell(identifier)="{value}">
      <ActionsCol v-if="value" :identifier="value" :edit-path="editPath+value" :remove="remove" />
    </template>
  </BTable>
</template>

<script>

import { CountryCol } from './Columns'
import   mixin        from './mixin'

const columns = [
  { key: 'Title',            label: '' },
  { key: 'FirstName',        label: 'First Name' },
  { key: 'LastName',         label: 'Last Name' },
  { key: 'OrganizationName', label: 'Organization' },
  { key: 'Country',          label: 'Country', class: 'text-center' },
  { key: 'Score',            label: 'Rank' }
]

export default {
  name      : 'ContactsList',
  components: { CountryCol },
  mixins    : [ mixin ],
  data,
  methods   : { remove }
}

function data (){
  const { conferenceCode } = this.$route.params
  const   editPath         = `/${conferenceCode}/contacts/`

  return { columns, editPath }
}

function remove (identifier){ alert(`delete contact ${identifier}`) }

</script>
<style scoped>
.list{ width: 100%; }
</style>
