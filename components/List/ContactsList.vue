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
      @filtered="onFiltered"
    >
      <!-- https://bootstrap-vue.js.org/docs/components/table#scoped-field-slots -->

      <template v-slot:table-busy>
        <div class="text-center text-danger my-2">
          <CIcon name="circleNotch" class="fa-spin fa-3x fa-fw" />
          <strong>Loading...</strong>
        </div>
      </template>
      <template v-slot:head(Title)>
        <span class="text-center">
          <CIcon name="idBadge" />
        </span>
      </template>

      <template v-slot:cell(Country)="{value}">
        <CountryCol v-if="value" :code="value" />
      </template>

      <template v-slot:cell(OrganizationGovernment)="{value}">
        <CountryCol v-if="value" :code="value" />
      </template>

      <template v-slot:cell(Emails)="{value}">
        <EmailCol v-if="value" :emails="value" />
      </template>

      <template v-slot:cell(identifier)="{value}">
        <ActionsCol v-if="value" :identifier="value" :edit-path="editPath+value" :remove="remove" />
      </template>

      <template v-slot:cell(StatusEvent1Date)="data">
        <span
          :class="RegistrationStatuses[data.item.StatusEvent1]"
        >{{ getLocalDateString(data.item.StatusEvent1Date) }}</span>
      </template>
      <template v-slot:cell(StatusEvent2Date)="data">
        <span
          :class="RegistrationStatuses[data.item.StatusEvent2]"
        >{{ getLocalDateString(data.item.StatusEvent2Date) }}</span>
      </template>
      <template v-slot:cell(StatusEvent3Date)="data">
        <span
          :class="RegistrationStatuses[data.item.StatusEvent3]"
        >{{ getLocalDateString(data.item.StatusEvent3Date) }}</span>
      </template>
      <template v-slot:cell(StatusEvent4Date)="data">
        <span
          :class="RegistrationStatuses[data.item.StatusEvent4]"
        >{{ getLocalDateString(data.item.StatusEvent4Date) }}</span>
      </template>
    </BTable>
  </div>
</template>

<script>
import { CountryCol, EmailCol } from './Columns'
import mixin from './mixin'

const columns = []

const orignalColumns = [
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
  methods   : { remove, onFiltered, getLocalDateString }
}

function getLocalDateString (value){
  if (value !== undefined) return new Date(value).toLocaleString()
  else return ''
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
  const RegistrationStatuses = {
    1: 'nominated-text-red',
    2: 'accredited-text-red',
    4: 'registered-text-red'
  }

  return {
    columns,
    editPath,
    currentPage,
    perPage,
    pageOptions,
    RegistrationStatuses
  }
}

function onFiltered (filteredItems){
  this.columns = [].concat(orignalColumns)
  for (let index = 0; index < this.filter.selectedMeetings.length; index++)
    if (index < 4)
      this.columns = [
        ...this.columns,
        {
          key     : 'StatusEvent' + (index + 1) + 'Date',
          label   : this.filter.selectedMeetings[index].Code,
          sortable: true
        }
      ]
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
