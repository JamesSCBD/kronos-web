<template>
  <div>
    <div class="paginationRow">
      <BFormSelect id="perPageSelect" v-model="perPage" :options="pageOptions" />
      <BPagination
        v-model="currentPage"
        :total-rows="totalRows"
        :per-page="perPage"
        prev-text="Prev"
        next-text="Next"
        aria-controls="KContactsList"
        limit="1"
        hide-goto-end-buttons
      />
    </div>
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
      :per-page="perPage"
      :current-page="currentPage"
    >
      <!-- https://bootstrap-vue.js.org/docs/components/table#scoped-field-slots -->

      <template v-slot:cell(Country)="{value}">
        <CountryCol v-if="value" :code="value" />
      </template>

      <template v-slot:cell(identifier)="{value}">
        <ActionsCol v-if="value" :identifier="value" :edit-path="editPath+value" :remove="remove" />
      </template>
    </BTable>
  </div>
</template>

<script>
import mixin from './mixin'

const columns = [
  { key: 'OrganizationName', label: 'Organization' },
  { key: 'OrganizationAcronym', label: 'Acronym' },
  { key: 'MemberCount', label: '# of Members' },
  { key: 'EventCount', label: '# of Events' },
  { key: 'Country', label: 'Country', class: 'text-center' },
  { key: 'Score', label: 'Rank' }
]

export default {
  name   : 'OrganizationsList',
  mixins : [ mixin ],
  data,
  methods: { remove }
}

function data (){
  const { conferenceCode } = this.$route.params
  const editPath = `/${conferenceCode}/organizations/`
  const currentPage = 1

  const perPage = 25
  const pageOptions = [
    { value: 25, text: '25/page' },
    { value: 50, text: '50/page' },
    { value: 100, text: '100/page' },
    { value: 250, text: '250/page' }
  ]

  return { columns, editPath, currentPage, perPage, pageOptions }
}

function remove (identifier){
  alert(`delete org ${identifier}`)
}
</script>
<style scoped>
.list {
  width: 100%;
}
</style>
