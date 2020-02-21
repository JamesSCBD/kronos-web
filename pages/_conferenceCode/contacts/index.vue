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
                  v-model="filter.meetingsValue"
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
                    <div v-if="filter.meetingsValue.length" class="multiselect__clear" />
                  </template>
                </multiselect>
              </div>
            </div>
            <div class="col-md-4 col-sm-4 col-xs-12 pl-0">
              <div class="form-group">
                <BFormSelect v-model="filter.selectedAttendance" size="sm" class="w-25" :options="attendanceOptions" />
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
              :close-on-select="false"
              :options-limit="300"
              :limit="3"
              :max-height="600"
              @search-change="asyncFind"
            />
          </div>
        </div>
        <div class="col-md-6 col-sm-6 col-xs-12">
          <div class="form-group">
            <BFormSelect id="flagSelect" v-model="filter.selectedFlag" size="sm" :options="flagOptions" />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6 col-sm-6 col-xs-12">
          <div class="row">
            <div class="col-md-8 col-sm-7 col-xs-12 pr-0">
              <div class="form-group">
                <BFormSelect
                  id="countrySelect"
                  v-model="filter.selectedCountry"
                  size="sm"
                  value-field="Code"
                  text-field="Name"
                  :options="countryOptions"
                  class="w-75"
                />
              </div>
            </div>
            <div class="col-md-4 col-sm-5 col-xs-12 pl-0">
              <div class="form-group">
                <BFormSelect v-model="filter.selectedScop" size="sm" class="w-25" :options="scopOptions" />
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-sm-6 col-xs-12">
          <div class="form-group">
            <BFormSelect
              id="organizationTypeSelect"
              v-model="filter.selectedOrganizationType"
              text-field="Title"
              value-field="OrganizationTypeUID"
              size="sm"
              :options="organizationTypesOptions"
              class="w-25"
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
import {
  BFormInput,
  BFormCheckbox,
  BFormSelect
} from 'bootstrap-vue'

import Multiselect from 'vue-multiselect'

export default {
  name      : 'Contacts',
  components: {
    List,
    BFormInput,
    BFormCheckbox,
    BFormSelect,
    Multiselect
  },
  data    : initData,
  computed: { totalRows: rows },
  methods : { tableItems: search, clearAll, getMeetingsList, asyncFind },
  auth    : readOnly
}

// ===================
//
// ===================
function initData (){
  return {
    loading          : false,
    sizes            : [ 'Small', 'Medium', 'Large', 'Extra Large' ],
    countryOptions   : [],
    flagOptions      : [ 'Funded', 'priority' ],
    attendanceOptions: [ 'Nominated', 'Accredited', 'Registered' ],
    scopOptions      : [ 'Any', 'Goverment', 'Country/Address' ],
    filter           : {
      name                    : '',
      isBroadSearch           : false,
      meetingsValue           : [],
      selectedOrganizationType: '',
      selectedOrganization    : '',
      selectedCountry         : '',
      selectedFlag            : '',
      selectedAttendance      : '',
      selectedScop            : ''
    },
    meetingsOptions         : [],
    selectedCountrie        : [],
    organizationOptions     : [],
    organizationTypesOptions: []
  }
}

//= ===================
//
//= ===================
async function search (ctx){
  try {
    this.loading = true
    const query = buildQuery(ctx)
    const rows = await this.$kronosApi.getContacts(query)
    const query1 = {
      FullText: ''
    }

    this.meetingsOptions = await this.$kronosApi.getMeetings(query1)
    this.countryOptions = await this.$kronosApi.getCountries()
    this.organizationTypesOptions = await this.$kronosApi.getOrganizationTypes()

    const data = rows.map(r => ({ ...r, identifier: r.ContactUID }))

    return data
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
    limit   : perPage || 25,
    skip    : skipRecord,
    FreeText: 'stephane bilodeau'
    // Need API param for sorting(shortBy,direction)
  }

  return query
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
  this.filter.meetingsValue = []
}
</script>
