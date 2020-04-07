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
                  v-model="searchTagInput"
                  type="search"
                  placeholder="Name / Acronym / #KEYWORD"
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
                      @mousedown.prevent.stop="clearSelectedOptions('meetings')"
                    />
                  </template>
                </multiselect>
              </div>
            </div>
            <div class="col-md-5 col-sm-5 col-xs-12 pl-0">
              <div class="form-group">
                <multiselect
                  v-model="filter.selectedAttendance"
                  label="name"
                  track-by="value"
                  placeholder="Attendance "
                  open-direction="bottom"
                  :options="attendanceOptions"
                  :multiple="true"
                  :clear-on-select="false"
                  :close-on-select="false"
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
                      @mousedown.prevent.stop="clearSelectedOptions('attendance')"
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
              v-model="filter.selectedOrganizationTypes"
              label="Title"
              track-by="OrganizationTypeUID"
              placeholder="Categories"
              :options="organizationTypeOptions"
              :multiple="true"
              :searchable="false"
              :clear-on-select="false"
              :close-on-select="true"
            >
              <template slot="tag" slot-scope="{ option, remove }">
                <span class="custom__tag">
                  <span>{{ option.Title }}</span>
                  <span class="custom__remove" @click="remove(option)">&times;</span>
                </span>
              </template>
              <template slot="selection" slot-scope="{ values }">
                <span
                  v-if="values.length > 1"
                  class="multiselect__single"
                >{{ values.length }} organization type selected</span>
              </template>
              <template slot="clear">
                <div
                  v-if="filter.selectedOrganizationTypes.length"
                  class="multiselect__clear"
                  @mousedown.prevent.stop="clearSelectedOptions('organization-type')"
                />
              </template>
            </multiselect>
          </div>
        </div>
        <div class="col-md-6 col-sm-6 col-xs-12">
          <div class="form-group">
            <multiselect
              v-model="filter.selectedValidationStatus"
              label="name"
              track-by="value"
              placeholder="Validation Status"
              :options="validationStatusOptions"
              :multiple="false"
              :searchable="false"
              :clear-on-select="false"
              :close-on-select="true"
            >
              <template slot="clear">
                <div
                  v-if="filter.selectedValidationStatus !== ''"
                  class="multiselect__clear"
                  @mousedown.prevent.stop="clearSelectedOptions('validation')"
                />
              </template>
            </multiselect>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6 col-sm-6 col-xs-12">
          <div class="row">
            <div class="col-md-7 col-sm-6 col-xs-12 pr-0">
              <div class="form-group">
                <multiselect
                  v-model="filter.selectedCountry"
                  label="Name"
                  track-by="Code"
                  placeholder="Country"
                  :options="countryOptions"
                  :multiple="true"
                  :searchable="true"
                  :clear-on-select="false"
                  :close-on-select="false"
                >
                  <template slot="tag" slot-scope="{ option, remove }">
                    <span class="custom__tag">
                      <span>{{ option.Name }}</span>
                      <span class="custom__remove" @click="remove(option)">❌</span>
                    </span>
                  </template>
                  <template slot="selection" slot-scope="{ values }">
                    <span
                      v-if="values.length > 1"
                      class="multiselect__single"
                    >{{ values.length }} country selected</span>
                  </template>
                  <template slot="clear">
                    <div
                      v-if="filter.selectedCountry.length"
                      class="multiselect__clear"
                      @mousedown.prevent.stop="clearSelectedOptions('country')"
                    />
                  </template>
                </multiselect>
              </div>
            </div>
            <div class="col-md-5 col-sm-6 col-xs-12 pl-0">
              <div class="form-group">
                <multiselect
                  v-model="filter.selectedScop"
                  label="name"
                  track-by="value"
                  placeholder="Scope"
                  :options="scopeOptions"
                  :multiple="false"
                  :searchable="false"
                  :clear-on-select="false"
                  :close-on-select="true"
                >
                  <template slot="clear">
                    <div
                      v-if="filter.selectedScop !== ''"
                      class="multiselect__clear"
                      @mousedown.prevent.stop="clearSelectedOptions('scope')"
                    />
                  </template>
                </multiselect>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-sm-6 col-xs-12" />
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
import { mapGetters } from 'vuex'
import { readOnly } from '@roles'
import List from '@components/list/OrganizationsList'
import { BFormInput, BFormCheckbox } from 'bootstrap-vue'
import Multiselect from 'vue-multiselect'
import _ from 'lodash'

export default {
  name      : 'Organizations',
  components: { List, BFormInput, Multiselect, BFormCheckbox },
  data      : initData,
  computed  : {
    ...mapGetters({
      countryOptions         : 'countries/list',
      organizationTypeOptions: 'organizations/types'
    })
  },
  watch: {
    searchTagInput: _.debounce(onSearchTextChanged, 400)
  },
  mounted,
  methods: { tableItems: search, clearSelectedOptions, isFiltersApplied },
  auth   : readOnly
}

// ===================
//
// ===================
function initData (){
  return {
    loading  : false,
    totalRows: 0,
    filter   : {
      name                     : '',
      isBroadSearch            : false,
      selectedMeetings         : [],
      selectedAttendance       : [],
      selectedValidationStatus : '',
      selectedCountry          : [],
      selectedScop             : '',
      selectedOrganizationTypes: []
    },
    scopeOptions: [
      { name: 'Goverment', value: 'GOV' },
      { name: 'Country (Address)', value: 'CTR' }
    ],
    attendanceOptions: [
      { name: 'Nominated', value: 1 << 0, code: 'Nom' },
      { name: 'Accredited', value: 1 << 1, code: 'Acc' },
      { name: 'Registered', value: 1 << 2, code: 'Reg' }
    ],
    meetingsOptions        : [],
    validationStatusOptions: [
      { name: 'Any', value: undefined },
      { name: 'Validated', value: true },
      { name: 'Not Validated', value: false }
    ],
    searchTagInput: ''
  }
}

function onSearchTextChanged (value){
  this.filter.name = value
}

async function mounted (){
  this.meetingsOptions = await getMajorMinorMeetings(this)
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

// ===================
//
// ===================
async function search (ctx){
  try {
    if (isFiltersApplied(this)){
      this.loading = true

      const query = buildQuery(ctx)

      const rows = await this.$kronosApi.getOrganizations(query)

      this.totalRows = getTotalRows(ctx, this, rows.length)
      return rows.map(r => ({ ...r, identifier: r.OrganizationUID }))
    }
    else {
      ctx.currentPage = 1
      this.totalRows = 0
      return []
    }
  }
  finally {
    // TODO Handle error
    this.loading = false
  }
}

function isFiltersApplied (_this){
  if (
    _this.filter.name ||
    _this.filter.isBroadSearch ||
    _this.filter.selectedMeetings.length ||
    _this.filter.selectedOrganizationTypes.length ||
    _this.filter.selectedCountry.length ||
    _this.filter.selectedValidationStatus ||
    _this.filter.selectedAttendance.length ||
    _this.filter.selectedScop
  )
    return true
  else return false
}

// ===================
// Get total number of rows
// ===================
function getTotalRows (ctx, _this, _rowsLength){
  if (_rowsLength < ctx.perPage) return ctx.perPage * ctx.currentPage
  else return ctx.perPage * ctx.currentPage + 1
}

// ===================
// Build Query to pass to kronos api
// ===================
function buildQuery ({ filter, sortBy, sortDesc, perPage, currentPage }){
  // TODO:

  // apply List standard paramters: filter, sortBy, sortDesc, perPage, currentPage
  // and contact search filter to KronosQuery
  const skipRecord = currentPage > 0 ? (currentPage - 1) * perPage : 0
  const query = {
    FreeText               : filter.name || undefined,
    CountryScope           : filter.selectedScop.value || undefined,
    EventUIDs              : getSelectedMeetingsIds(filter),
    TypeUIDs               : getOrganizationTypeIds(filter),
    EventRegistrationStatus: getAttendanceValue(filter),
    Governments            : getCountryCodes(filter),
    IsValidated            : filter.selectedValidationStatus.value,
    limit                  : perPage || 25,
    skip                   : skipRecord
  }

  return query
}

function getOrganizationTypeIds (filter){
  return filter.selectedOrganizationTypes.length
    ? filter.selectedOrganizationTypes.map(o => o.OrganizationTypeUID)
    : undefined
}

function getCountryCodes (filter){
  return filter.selectedCountry.length
    ? filter.selectedCountry.map(c => c.Code)
    : undefined
}

function getAttendanceValue (filter){
  let registrationStatus = 0

  if (filter.selectedAttendance !== undefined)
    filter.selectedAttendance.forEach((element) => {
      registrationStatus += element.value
    })
  return registrationStatus || undefined
}

function getSelectedMeetingsIds (filter){
  return filter.selectedMeetings.length
    ? filter.selectedMeetings.map(m => m.EventUID)
    : undefined
}

function clearSelectedOptions (type){
  switch (type){
  case 'meetings':
    this.filter.selectedMeetings = []
    break
  case 'attendance':
    this.filter.selectedAttendance = []
    break
  case 'validation':
    this.filter.selectedValidationStatus = ''
    break
  case 'country':
    this.filter.selectedCountry = []
    break
  case 'scope':
    this.filter.selectedScop = ''
    break
  case 'organization-type':
    this.filter.selectedOrganizationTypes = []
    break
  }
}
</script>
