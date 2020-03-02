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
                  placeholder="Name / Barcode / #tags"
                />
              </div>
            </div>
            <div class="col-md-4 col-sm-5 col-xs-12">
              <div class="form-group">
                <BFormCheckbox v-model="filter.isBroadSearch">
                  Broad search
                </BFormCheckbox>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-sm-6 col-xs-12">
          <div class="row">
            <div class="col-md-7 col-sm-7 col-xs-12 pr-0">
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
                  :show-no-results="false"
                  :searchable="false"
                >
                  <template slot="tag" slot-scope="{ option, remove }">
                    <span class="custom__tag">
                      <span>{{ option.Code }}</span>
                      <span class="custom__remove" @click="remove(option)">❌</span>
                    </span>
                  </template>
                  <template slot="selection" slot-scope="{ values }">
                    <span
                      v-if="values.length > 2"
                      class="multiselect__single"
                    >{{ values.length }} meetings selected</span>
                  </template>
                  <template slot="clear">
                    <div
                      v-if="filter.selectedMeetings.length"
                      class="multiselect__clear"
                      @mousedown.prevent.stop="clearAllMeetings()"
                    />
                  </template>
                </multiselect>
              </div>
            </div>
            <div class="col-md-5 col-sm-5 col-xs-12 pl-0">
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
                  :show-no-results="false"
                >
                  <template slot="tag" slot-scope="{ option, remove }">
                    <span class="custom__tag">
                      <span>{{ option.code }}</span>
                      <span class="custom__remove" @click="remove(option)">❌</span>
                    </span>
                  </template>
                  <template slot="selection" slot-scope="{ values }">
                    <span
                      v-if="values.length > 2"
                      class="multiselect__single"
                    >{{ values.length }} attendance selected</span>
                  </template>
                  <template slot="clear">
                    <div
                      v-if="filter.selectedAttendance.length"
                      class="multiselect__clear"
                      @mousedown.prevent.stop="clearAllAttendance()"
                    />
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
              placeholder="Organization(autocomplete)"
              open-direction="bottom"
              :options="organizationOptions"
              :multiple="true"
              :searchable="true"
              :internal-search="true"
              :clear-on-select="false"
              :close-on-select="true"
              :max-height="300"
            >
              <template slot="tag" slot-scope="{ option, remove }">
                <span class="custom__tag">
                  <span>{{ option.OrganizationName }}</span>
                  <span class="custom__remove" @click="remove(option)">❌</span>
                </span>
              </template>
              <template slot="selection" slot-scope="{ values }">
                <span
                  v-if="values.length > 1"
                  class="multiselect__single"
                >{{ values.length }} organization selected</span>
              </template>
              <template slot="clear">
                <div
                  v-if="filter.selectedOrganization.length"
                  class="multiselect__clear"
                  @mousedown.prevent.stop="clearAllOrganization()"
                />
              </template>
            </multiselect>
          </div>
        </div>
        <div class="col-md-6 col-sm-6 col-xs-12">
          <div class="form-group">
            <multiselect
              id="ajax"
              v-model="filter.selectedFlag"
              label="name"
              track-by="value"
              placeholder="Special Flags..."
              :options="flagOptions"
              :multiple="true"
              :searchable="false"
              :clear-on-select="false"
              :close-on-select="true"
            >
              <template slot="tag" slot-scope="{ option, remove }">
                <span class="custom__tag">
                  <span>{{ option.name }}</span>
                  <span class="custom__remove" @click="remove(option)">❌</span>
                </span>
              </template>
              <template slot="selection" slot-scope="{ values }">
                <span
                  v-if="values.length > 2"
                  class="multiselect__single"
                >{{ values.length }} flags selected</span>
              </template>
              <template slot="clear">
                <div
                  v-if="filter.selectedFlag.length"
                  class="multiselect__clear"
                  @mousedown.prevent.stop="clearAllFlags()"
                />
              </template>
            </multiselect>
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
                  :multiple="true"
                  :searchable="true"
                  :clear-on-select="false"
                  :close-on-select="true"
                >
                  <template slot="tag" slot-scope="{ option, remove }">
                    <span class="custom__tag">
                      <span>{{ option.Name }}</span>
                      <span class="custom__remove" @click="remove(option)">❌</span>
                    </span>
                  </template>
                  <template slot="selection" slot-scope="{ values }">
                    <span
                      v-if="values.length > 2"
                      class="multiselect__single"
                    >{{ values.length }} country selected</span>
                  </template>
                  <template slot="clear">
                    <div
                      v-if="filter.selectedCountry.length"
                      class="multiselect__clear"
                      @mousedown.prevent.stop="clearAllCountry()"
                    />
                  </template>
                </multiselect>
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
    clearAllMeetings,
    getMeetingsList,
    getAttendanceValue,
    clearAllAttendance,
    clearAllOrganization,
    clearAllFlags,
    clearAllCountry
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
    flagOptions      : [ { name: 'Funded', value: 1 }, { name: 'Priority', value: 2 } ],
    attendanceOptions: [
      { name: 'Any', value: 0, code: 'Any' },
      { name: 'Nominated', value: 1 << 0, code: 'Nom' },
      { name: 'Accredited', value: 1 << 1, code: 'Acc' },
      { name: 'Registered', value: 1 << 2, code: 'Reg' }
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
      selectedOrganization    : [],
      selectedCountry         : [],
      selectedFlag            : [],
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
  this.meetingsOptions = await getMajorMinorMeetings(this)

  this.organizationOptions = await this.$kronosApi.getOrganizations({
    limit: 5000
  })

  const country = await this.$kronosApi.getCountries()

  sortCountryByAsc(country, this)

  this.organizationTypesOptions = await this.$kronosApi.getOrganizationTypes()
}

async function getMajorMinorMeetings (_this){
  const majorEventIDs = []
  const minorEventIDs = []

  const majorMeetingsData =
    _this.$store.getters['conferences/selected'].MajorEventIDs
  const minorMeetingsData =
    _this.$store.getters['conferences/selected'].MinorEventIDs

  majorMeetingsData.forEach((element) => {
    majorEventIDs.push('00000000' + element)
  })

  minorMeetingsData.forEach((element) => {
    minorEventIDs.push('00000000' + element)
  })

  const majorMeetings = await _this.$kronosApi.getMeetings({
    EvenUIDs: majorEventIDs
  })

  const minorMeetings = await _this.$kronosApi.getMeetings({
    EvenUIDs: minorEventIDs
  })

  const meetingDivider = [
    {
      EventUID   : '00000000000000000000000000000000',
      Code       : '-----------------------------',
      Title      : '-----------------------------',
      $isDisabled: true
    }
  ]

  return majorMeetings.concat(meetingDivider).concat(minorMeetings)
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

    // query = { limit: 25 }
    const rows = await this.$kronosApi.getContacts(query)

    return rows.map(r => ({ ...r, identifier: r.ContactUID }))
  }
  finally {
    // TODO Handle error
    this.loading = false
  }
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
    Governments     : filter.selectedCountry.length ? getCountryCodes(filter) : null,
    limit           : perPage || 25,
    CountryScope    : filter.selectedScop.name, //TODO
    skip            : skipRecord,
    FreeText        : filter.name,
    OrganizationUIDs: filter.selectedOrganization.length
      ? getOrganizationIds(filter)
      : null,
    EventUIDs: filter.selectedMeetings.length
      ? getSelectedMeetingsIds(filter)
      : null,
    EventRegistrationStatus: filter.selectedAttendance.length
      ? getAttendanceValue(filter)
      : null,
    StatusForEventUID1: getMeetingsIds(filter, 0),
    StatusForEventUID2: getMeetingsIds(filter, 1),
    StatusForEventUID3: getMeetingsIds(filter, 2),
    StatusForEventUID4: getMeetingsIds(filter, 3)
  }

  return query
}

function getSelectedMeetingsIds (filter){
  const meetingIds = []

  filter.selectedMeetings.forEach((value) => {
    meetingIds.push(value.EventUID)
  })
  return meetingIds
}

function getMeetingsIds (filter, index){
  let meetingId = null

  if (filter.selectedMeetings.length > index)
    meetingId = filter.selectedMeetings[index].EventUID

  return meetingId
}

function getOrganizationIds (filter){
  const oraganizationIds = []

  filter.selectedOrganization.forEach((value) => {
    oraganizationIds.push(value.OrganizationUID)
  })
  return oraganizationIds
}

function getCountryCodes (filter){
  const countryCodes = []

  filter.selectedCountry.forEach((value) => {
    countryCodes.push(value.Code)
  })
  return countryCodes
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

function clearAllMeetings (){
  this.filter.selectedMeetings = []
}

function clearAllAttendance (){
  this.filter.selectedAttendance = []
}

function clearAllOrganization (){
  this.filter.selectedOrganization = []
}

function clearAllFlags (){
  this.filter.selectedFlag = []
}

function clearAllCountry (){
  this.filter.selectedCountry = []
}
</script>
