<template>
  <BTable
    id="KOrganizationList"
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

    <template v-slot:cell(Country)="{value}">
      <CountryCol v-if="value" :code="value" />
    </template>

    <template v-slot:cell(meta)="{value}">
      <MetaCol v-if="value" v-bind="value" />
    </template>

    <template v-slot:cell(identifier)="{value}">
      <ActionsCol v-if="value" :identifier="value" :edit-path="editPath+value" :remove="remove" />
    </template>
  </BTable>
</template>

<script>

import mixin  from './mixin'

const columns  = [
  { key: 'OrganizationName',     label: 'Organization' },
  { key: 'OrganizationAcronym',  label: 'Acronym' },
  { key: 'MemberCount',          label: '# of Members' },
  { key: 'EventCount',           label: '# of Events' },
  { key: 'Country',              label: 'Country', class: 'text-center' },
  { key: 'Score',                label: 'Rank' }
]

export default {
  name   : 'OrganizationsList',
  mixins : [ mixin ],
  data,
  methods: { remove }
}

function data (){
  const { conferenceCode } = this.$route.params
  const   editPath         = `/${conferenceCode}/organizations/`

  return { columns, editPath }
}

function remove (identifier){ alert(`delete org ${identifier}`) }

</script>
<style scoped>
.list{ width: 100%; }
</style>
