<template>
  <div class="container-fluid">
    <div class="filter_Sec">
      <h5 class="sec_ttl">
        Filter
      </h5>
      <div class="row">
        <div class="col-md-6 col-sm-6 col-xs-12">
          <div class="row">
            <div class="col-md-8 col-sm-7 col-xs-12">
              <div class="form-group">
                <BFormInput
                  id="filterInput"
                  v-model="filter.name"
                  type="search"
                  placeholder="Name /BarCode /#tags"
                />
              </div>
            </div>
            <div class="col-md-4 col-sm-5 col-xs-12">
              <div class="form-group">
                <BFormCheckbox v-model="filter.isBroadSearch">
                  Broad Serach
                </BFormCheckbox>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-sm-6 col-xs-12">
          <div class="row">
            <div class="col-md-8 col-sm-8 col-xs-12 pr-0">
              <div class="form-group">
                <multiselect
                  id="ajax"
                  v-model="filter.selectedMeetings"
                  label="Code"
                  track-by="Code"
                  placeholder="Meetings"
                  open-direction="bottom"
                  :options="meetingsOptions"
                  :multiple="true"
                  :clear-on-select="false"
                  :close-on-select="false"
                  :options-limit="10"
                  :limit="2"
                  :show-no-results="false"
                >
                  <template slot="tag" slot-scope="{ option, remove }">
                    <span class="custom__tag">
                      <span>{{ option.Code }}</span>
                      <span class="custom__remove" @click="remove(option)">❌</span>
                    </span>
                  </template>
                  <template slot="clear">
                    <div v-if="filter.selectedMeetings.length" class="multiselect__clear" />
                  </template>
                </multiselect>
              </div>
            </div>
            <div class="col-md-4 col-sm-4 col-xs-12 pl-0">
              <div class="form-group">
                <multiselect
                  id="ajax"
                  v-model="filter.selectedAttendance"
                  label="name"
                  track-by="value"
                  placeholder="Attendance "
                  open-direction="bottom"
                  :options="attendanceOptions"
                  :multiple="true"
                  :clear-on-select="false"
                  :close-on-select="true"
                  :options-limit="4"
                  :limit="1"
                  :show-no-results="false"
                >
                  <template slot="tag" slot-scope="{ option, remove }">
                    <span class="custom__tag">
                      <span>{{ option.name }}</span>
                      <span class="custom__remove" @click="remove(option)">❌</span>
                    </span>
                  </template>
                  <template slot="clear">
                    <div v-if="filter.selectedAttendance.length" class="multiselect__clear" />
                  </template>
                </multiselect>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6 col-sm-6 col-xs-12">
          <div class="form-group">
            <multiselect
              id="ajax"
              v-model="filter.selectedOrganization"
              label="OrganizationName"
              track-by="OrganizationUID"
              placeholder="Type to search"
              open-direction="bottom"
              :options="organizationOptions"
              :multiple="false"
              :searchable="true"
              :internal-search="false"
              :clear-on-select="false"
              :close-on-select="true"
              :options-limit="300"
              :limit="3"
              :max-height="600"
              @search-change="asyncFind"
            />
          </div>
        </div>
        <div class="col-md-6 col-sm-6 col-xs-12">
          <div class="form-group">
            <multiselect
              id="ajax"
              v-model="filter.selectedFlag"
              label="name"
              track-by="value"
              placeholder="Special Flag"
              :options="flagOptions"
              :multiple="false"
              :searchable="false"
              :clear-on-select="false"
              :close-on-select="true"
            />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6 col-sm-6 col-xs-12">
          <div class="row">
            <div class="col-md-8 col-sm-7 col-xs-12 pr-0">
              <div class="form-group">
                <multiselect
                  id="ajax"
                  v-model="filter.selectedCountry"
                  label="Name"
                  track-by="Code"
                  placeholder="Country"
                  :options="countryOptions"
                  :multiple="false"
                  :searchable="false"
                  :clear-on-select="false"
                  :close-on-select="true"
                />
              </div>
            </div>
            <div class="col-md-4 col-sm-5 col-xs-12 pl-0">
              <div class="form-group">
                <multiselect
                  id="ajax"
                  v-model="filter.selectedScop"
                  label="name"
                  track-by="value"
                  placeholder="Scope"
                  :options="scopeOptions"
                  :multiple="false"
                  :searchable="false"
                  :clear-on-select="false"
                  :close-on-select="true"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-sm-6 col-xs-12">
          <div class="form-group">
            <multiselect
              id="ajax"
              v-model="filter.selectedOrganizationType"
              label="Title"
              track-by="OrganizationTypeUID"
              placeholder="Categories"
              :options="organizationTypesOptions"
              :multiple="false"
              :searchable="false"
              :clear-on-select="false"
              :close-on-select="true"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <List
          :table-items="tableItems"
          :loading="loading"
          :total-rows="totalRows"
          :filter="filter"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { readOnly } from '@roles'
import List from '@components/list/ContactsList'
import { BFormInput, BFormCheckbox } from 'bootstrap-vue'

import Multiselect from 'vue-multiselect'

export default {
  name      : 'Contacts',
  components: {
    List,
    BFormInput,
    BFormCheckbox,
    Multiselect
  },
  data    : initData,
  computed: { totalRows: rows },
  mounted,
  methods : {
    tableItems: search,
    clearAll,
    getMeetingsList,
    asyncFind,
    getAttendanceValue
  },
  auth: readOnly
}

// ===================
//
// ===================
function initData (){
  return {
    loading          : false,
    sizes            : [ 'Small', 'Medium', 'Large', 'Extra Large' ],
    countryOptions   : [],
    flagOptions      : [ { name: 'Funded', value: 1 }, { name: 'priority', value: 2 } ],
    attendanceOptions: [
      { name: 'Any', value: '0' },
      { name: 'Nominated', value: 1 << 0 },
      { name: 'Accredited', value: 1 << 1 },
      { name: 'Registered', value: 1 << 2 }
    ],
    scopeOptions: [
      { name: 'Any', value: 1 },
      { name: 'Goverment', value: 2 },
      { name: 'Country/Address', value: 3 }
    ],
    filter: {
      name                    : '',
      isBroadSearch           : false,
      selectedMeetings        : [],
      selectedOrganizationType: '',
      selectedOrganization    : '',
      selectedCountry         : '',
      selectedFlag            : '',
      selectedAttendance      : [],
      selectedScop            : ''
    },
    meetingsOptions         : [],
    selectedCountrie        : [],
    organizationOptions     : [],
    organizationTypesOptions: []
  }
}

async function mounted (){
  this.meetingsOptions = await this.$kronosApi.getMeetings({ FullText: '' })
  const country =  await this.$kronosApi.getCountries()

  sortCountryByAsc(country, this)
  this.organizationTypesOptions = await this.$kronosApi.getOrganizationTypes()
}

function sortCountryByAsc (country, _this){
  _this.countryOptions = country.sort((a, b) => {
    const nameA = a.Name.toLowerCase()
    const nameB = b.Name.toLowerCase()

    if (nameA < nameB) return -1
    if (nameA > nameB) return 1
    return 0
  })
}

//= ===================
//
//= ===================
async function search (ctx){
  try {
    this.loading = true
    const query = buildQuery(ctx)
    const rows = await this.$kronosApi.getContacts(query)

    return rows.map(r => ({ ...r, identifier: r.ContactUID }))
  }
  finally {
    // TODO Handle error
    this.loading = false
  }
}

async function asyncFind (query){
  this.organizationOptions = await this.$kronosApi.getOrganizations({
    limit: 100
  })
}

// ===================
// Build Query to pass to kronos api
// ===================
function buildQuery ({ filter, sortBy, sortDesc, perPage, currentPage }){
  // TODO:
  // apply Boostrap standard paramters: filter, sortBy, sortDesc, perPage, currentPage
  // and contact search filter to KronosQuery
  const skipRecord = currentPage > 0 ? (currentPage - 1) * perPage : 0
  const query = {
    limit                  : perPage || 25,
    skip                   : skipRecord,
    FreeText               : filter.name,
    EventRegistrationStatus: getAttendanceValue(filter),
    StatusForEventUID1     : getMeetingsIds(filter, 0),
    StatusForEventUID2     : getMeetingsIds(filter, 1),
    StatusForEventUID3     : getMeetingsIds(filter, 2),
    StatusForEventUID4     : getMeetingsIds(filter, 3),
    OrganizationUIDs       : getOrganizationIds(filter),
    Governments            :
      filter.selectedCountry === '' || filter.selectedCountry === null ? '' : [ filter.selectedCountry.Code ],
    CountryScope: 'Country'

    // Need API param for sorting(shortBy,direction)
  }

  return query
}
function getMeetingsIds (filter, index){
  let meetingId = null

  if (filter.selectedMeetings.length > index)
    meetingId = filter.selectedMeetings[index].EventUID

  return meetingId
}

function getOrganizationIds (filter){
  const oraganizationIds = []

  if (filter.selectedOrganization !== '')
    oraganizationIds.push(filter.selectedOrganization.OrganizationUID)

  return oraganizationIds
}

function getAttendanceValue (filter){
  let registrationStatus = 0

  if (filter.selectedAttendance !== undefined)
    filter.selectedAttendance.forEach((element) => {
      registrationStatus += element.value
    })
  return registrationStatus
}

// ===================
// Get total number of rows
// ===================
function rows (){
  return 650 // Need API for total count of contacts
}

async function getMeetingsList (){
  const query = {
    FullText: ''
  }
  const rows = await this.$kronosApi.getMeetings(query)

  return rows
}

function clearAll (){
  this.filter.selectedMeetings = []
}
</script>
