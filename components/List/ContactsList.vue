<template>
  <div>
    <div class="paginationRow">
      <BFormSelect id="page-size" v-model="pageSize" class="form-control" :options="pageOptions" />
      <BPagination
        v-model="currentPage"
        :total-rows="totalRows"
        :per-page="pageSize"
        prev-text="Prev"
        next-text="Next"
        aria-controls="KContactsList"
        hide-goto-end-buttons
        limit="4"
      />
    </div>

    <BTable
      id="KContactsList"
      :items="searchContacts"
      :fields="columns"
      :busy="loading"
      class="mb-0 table-outline list"
      responsive="md"
      hover
      head-variant="light"
      sort-icon-left
      :per-page="pageSize"
      :current-page="currentPage"
      :filter="baseQuery"
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

      <template v-slot:cell(StatusEvent1Date)="data">
        <span
          :class="registrationStatuses[data.item.StatusEvent1]"
        >{{ data.item.StatusEvent1Date | toLocalDate }}</span>
      </template>
      <template v-slot:cell(StatusEvent2Date)="data">
        <span
          :class="registrationStatuses[data.item.StatusEvent2]"
        >{{ data.item.StatusEvent2Date | toLocalDate }}</span>
      </template>
      <template v-slot:cell(StatusEvent3Date)="data">
        <span
          :class="registrationStatuses[data.item.StatusEvent3]"
        >{{ data.item.StatusEvent3Date | toLocalDate }}</span>
      </template>
      <template v-slot:cell(StatusEvent4Date)="data">
        <span
          :class="registrationStatuses[data.item.StatusEvent4]"
        >{{ data.item.StatusEvent4Date | toLocalDate }}</span>
      </template>
    </BTable>
  </div>
</template>

<script>
import _ from 'lodash'
import { CountryCol, EmailCol } from './Columns'
import mixin from './mixin'

const baseColumns = [
  { key: 'Title', label: '', sortable: false },
  { key: 'FirstName', label: 'First Name', sortable: true },
  { key: 'LastName', label: 'Last Name', sortable: true },
  { key: 'OrganizationGovernment', label: 'Government', sortable: true },
  { key: 'OrganizationName', label: 'Organization', sortable: true },
  { key: 'Emails', label: 'Email', sortable: true },
  { key: 'Country', label: 'Country', sortable: true, class: 'text-left' },
  { key: 'Score', label: 'Rank', sortable: true }
]

const pageOptions = [
  { value: 25, text: '25/page' },
  { value: 50, text: '50/page' },
  { value: 100, text: '100/page' },
  { value: 250, text: '250/page' }
]
const defaultPageSize = pageOptions[0].value
const defaultPage     = 1

const registrationStatuses = {
  1: 'nominated-text',
  2: 'accredited-text',
  4: 'registered-text'
}

export default {
  name      : 'ContactsList',
  components: { CountryCol, EmailCol },
  filters   : {
    toLocalDate
  },
  mixins: [ mixin ],
  props : {
    baseQuery: { type: Object, default: () => ({}) }
  },
  data (){
    return {
      loading    : false,
      columns    : [ ...baseColumns ],
      totalRows  : 0,
      currentPage: defaultPage,
      pageSize   : defaultPageSize,
      pageOptions,
      registrationStatuses
    }
  },
  mounted,
  methods: {
    resetPage,
    searchContacts,
    updateColumns,
    loadQueryString,
    saveQueryString,
    buildQuery
  }
}

function mounted (){
  this.loadQueryString()
}

//=================================
//
//=================================
function buildQuery (){
  const query = _(this.baseQuery || {}).omitBy(_.isNil).value()

  if (_.isEmpty(query))
    return null

  const limit = this.pageSize
  const skip  = this.pageSize * (this.currentPage - 1)

  if (limit) query.limit = limit
  if (skip)  query.skip  = skip

  //todo sort

  return query
}

//=================================
//
//=================================
async function searchContacts (ctx){
  try {
    this.loading = true
    
    this.updateColumns()
    this.saveQueryString()

    const query = this.buildQuery()

    if (!query)
      return
      
    const rows = await this.$kronosApi.getContacts(query)

    this.totalRows = 1234 //TODO

    return rows.map(r => ({ ...r, identifier: r.ContactUID }))
  }
  finally {
    this.loading = false
  }
}

//=================================
//
//=================================
function resetPage (){
  this.currentPage = defaultPage
  this.totalRows = 0
}

//=================================
//
//=================================
function loadQueryString (){
  const { page, pageSize } = this.$route.query

  this.currentPage = parseInt(page)     || defaultPage
  this.pageSize    = parseInt(pageSize) || defaultPageSize
}

//=================================
//
//=================================
function saveQueryString (){
  const params = {
    pageSize: undefined,
    page    : undefined,
    sorts   : undefined
  }

  if (this.currentPage != defaultPage)     params.page     = this.currentPage
  if (this.pageSize    != defaultPageSize) params.pageSize = this.pageSize

  const newQueryString =  Object.assign({}, this.$route.query, params)

  this.$router.push({ query: newQueryString })
}

//=================================
//
//=================================
function toLocalDate (value){
  if (value) return new Date(value).toLocaleString()
  else return ''
}

//=================================
//
//=================================
function updateColumns (){
  this.columns = [ ...baseColumns ]

  const query = this.baseQuery || {}
  const eventUIDs = _.compact([ query.StatusForEventUID1, query.StatusForEventUID2, query.StatusForEventUID3, query.StatusForEventUID4 ])

  if (!eventUIDs)
    return

  for (let index = 0; index < eventUIDs.length; index++)
    if (index < 4)
      this.columns = [
        ...this.columns,
        {
          key     : 'StatusEvent' + (index + 1) + 'Date',
          label   : eventUIDs[index],
          sortable: true
        }
      ]
}

</script>
<style scoped>
.list {
  width: 100%;
}

.paginationRow {
  display: inline-block;
  width: 100%;
  text-align: right;
}

select#page-size {
  display: inline;
  width: auto;
  margin: 0px 5px;
}
ul.pagination.b-pagination {
  width: auto;
  float: right;
}
</style>
