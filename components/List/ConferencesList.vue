<template>
  <BTable

    id="KConferenceList"
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

    <template v-slot:cell(fullName)="{item}">
      <div>
        <FullNameCol v-bind="item.fullName" />
      </div>
    </template>

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

// import { } from './Columns'
import { DateTime } from 'luxon'
import   mixin      from './mixin'

const dateFormatter = v => DateTime.fromISO(v).toFormat('dd LLL yyyy HH:mm') // 13 Jan 2020 20:34

// conferences
const columns = [
  { key: 'code',           label: 'Code',         sortable: true },
  { key: 'Title.en',       label: 'Title',        sortable: true },
  { key: 'Description.en', label: 'Description',  sortable: true },
  { key: 'StartDate',      label: 'Start',        sortable: true, formatter: dateFormatter },
  { key: 'EndDate',        label: 'End',          sortable: true, formatter: dateFormatter },
  { key: 'timezone',       label: 'Timezone',     sortable: true },
  { key: 'institution',    label: 'Institution',  sortable: true }
]

export default {
  name      : 'ConferenceList',
  components: {  },
  mixins    : [ mixin ],
  data
}

function data (){ return { columns } }

</script>
<style scoped>
.list{ width: 100%; }
</style>
