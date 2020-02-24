<template>
  <div>
    <div class="paginationRow">
      <BFormSelect id="perPageSelect" v-model="perPage" :options="pageOptions" />
      <BPagination
        v-model="currentPage"
        :total-rows="totalRows"
        :per-page="perPage"
        first-text="First"
        prev-text="Prev"
        next-text="Next"
        last-text="Last"
        aria-controls="KContactsList"
        limit="4"
      />
    </div>
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
      :per-page="perPage"
      :current-page="currentPage"
      :filter="filter"
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

      <template v-slot:cell(OrganizationGovernment)="{value}">
        <CountryCol v-if="value" :code="value" />
      </template>

      <template v-slot:cell(Emails)="{value}">
        <EmailCol v-if="value" :email="value" />
      </template>

      <template v-slot:cell(identifier)="{value}">
        <ActionsCol v-if="value" :identifier="value" :edit-path="editPath+value" :remove="remove" />
      </template>
    </BTable>
  </div>
</template>

<script>
import { CountryCol, EmailCol  } from './Columns'
import mixin from './mixin'

const columns = [
  { key: 'Title', label: '', sortable: false },
  { key: 'FirstName', label: 'First Name', sortable: true },
  { key: 'LastName', label: 'Last Name', sortable: true },
  { key: 'OrganizationGovernment', label: 'Government', sortable: true },
  { key: 'OrganizationName', label: 'Organization', sortable: true },
  { key: 'Emails', label: 'Email', sortable: true },
  { key: 'Country', label: 'Country', sortable: true, class: 'text-left' },
  { key: 'Score', label: 'Rank', sortable: true }
]

export default {
  name      : 'ContactsList',
  components: { CountryCol, EmailCol },
  mixins    : [ mixin ],
  data,
  methods   : { remove }
}

function data (){
  const { conferenceCode } = this.$route.params
  const editPath = `/${conferenceCode}/contacts/`
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
  alert(`delete contact ${identifier}`)
}
</script>
<style scoped>
.list {
  width: 100%;
}
</style>
