<template>
  <BTable
    id="KOrganizationList"
    :items="tableItems"
    :fields="tableFields"
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

import   mixin                                 from './mixin'
import { OrganizationName, OrganizationAcronym, MemberCount, EventCount, Country, meta } from '~/configs/table-fields'

const tableFields = [ OrganizationName, OrganizationAcronym, MemberCount, EventCount, Country, meta ]

export default {
  name   : 'OrganizationsList',
  mixins : [ mixin ],
  data,
  methods: { remove }
}

function data (){
  const { conferenceCode } = this.$route.params
  const   editPath         = `/${conferenceCode}/organizations/`

  return { tableFields, editPath }
}

function remove (identifier){ alert(`delete org ${identifier}`) }

</script>
<style scoped>
.list{ width: 100%; }
</style>
