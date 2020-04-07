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
                  v-model="name"
                  type="search"
                  placeholder="Name / Barcode / #tags"

                  @input="onNameTextChange"
                />
              </div>
            </div>
            <div class="col-md-4 col-sm-5 col-xs-12">
              <div class="form-group">
                <BFormCheckbox v-model="isBroadSearch">
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
                  v-model="selectedMeetings"
                  label="Code"
                  track-by="EventUID"
                  placeholder="Meetings"
                  open-direction="bottom"
                  :options="meetingsOptions"
                  group-values="events"
                  group-label="title"
                  :group-select="false"
                  :multiple="true"
                  :clear-on-select="false"
                  :close-on-select="false"
                  :show-no-results="false"
                  :searchable="true"
                >
                  <template slot="tag" slot-scope="{ option, remove }">
                    <span class="custom__tag">
                      <span>{{ option.Code }}</span>
                      <span class="custom__remove" @click="remove(option)">&times;</span>
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
                      v-if="selectedMeetings.length"
                      class="multiselect__clear"
                      @mousedown.prevent.stop="selectedMeetings = null"
                    />
                  </template>
                </multiselect>
              </div>
            </div>
            <div class="col-md-5 col-sm-5 col-xs-12 pl-0">
              <div class="form-group">
                <multiselect
                  v-model="selectedAttendances"
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
                      <span class="custom__remove" @click="remove(option)">&times;</span>
                    </span>
                  </template>
                  <template slot="clear">
                    <div
                      v-if="selectedAttendances.length"
                      class="multiselect__clear"
                      @mousedown.prevent.stop="selectedAttendances = null"
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
              v-model="selectedOrganizations"
              label="OrganizationName"
              track-by="OrganizationUID"
              placeholder="Search organization"
              open-direction="bottom"
              :options="organizationOptions"
              :multiple="true"
              :searchable="true"
              :loading="isLoadingOrganization"
              :internal-search="false"
              :clear-on-select="false"
              :close-on-select="false"
              :max-height="300"
              @search-change="onOrganizationTextChange"
            >
              <template slot="option" slot-scope="props">
                <span class="float-right">{{ props.option.Score }}</span>
                <span>{{ props.option.OrganizationName }}</span>
                <b v-if="props.option.OrganizationAcronym">{{ props.option.OrganizationAcronym }}</b>
                <i v-if="props.option.MemberCount>=0">({{ props.option.MemberCount }})</i>
              </template>
              <template slot="tag" slot-scope="{ option, remove }">
                <span class="custom__tag">
                  <span>{{ option.OrganizationAcronym || option.OrganizationName }}</span>
                  <span class="custom__remove" @click="remove(option)">&times;</span>
                </span>
              </template>
              <template slot="selection" slot-scope="{ values }">
                <span
                  v-if="values.length > 3"
                  class="multiselect__single"
                >{{ values.length }} organizations selected</span>
              </template>
              <template slot="clear">
                <div
                  v-if="selectedOrganizations.length"
                  class="multiselect__clear"
                  @mousedown.prevent.stop="selectedOrganizations = null"
                />
              </template>
            </multiselect>
          </div>
        </div>
        <div class="col-md-6 col-sm-6 col-xs-12">
          <div class="form-group">
            <multiselect
              v-model="selectedFlags"
              label="name"
              track-by="value"
              placeholder="Special Flags..."
              :options="flagOptions"
              :multiple="true"
              :searchable="false"
              :clear-on-select="false"
              :close-on-select="false"
            >
              <template slot="tag" slot-scope="{ option, remove }">
                <span class="custom__tag">
                  <span>{{ option.name }}</span>
                  <span class="custom__remove" @click="remove(option)">&times;</span>
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
                  v-if="selectedFlags.length"
                  class="multiselect__clear"
                  @mousedown.prevent.stop="selectedFlags = null"
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
                  v-model="selectedCountries"
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
                      <span class="custom__remove" @click="remove(option)">&times;</span>
                    </span>
                  </template>
                  <template slot="selection" slot-scope="{ values }">
                    <span
                      v-if="values.length > 1"
                      class="multiselect__single"
                    >{{ values.length }} countries selected</span>
                  </template>
                  <template slot="clear">
                    <div
                      v-if="selectedCountries.length"
                      class="multiselect__clear"
                      @mousedown.prevent.stop="selectedCountries = null"
                    />
                  </template>
                </multiselect>
              </div>
            </div>
            <div class="col-md-5 col-sm-6 col-xs-12 pl-0">
              <div class="form-group">
                <multiselect
                  v-model="selectedCountryScope"
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
                      v-if="selectedCountryScope !== ''"
                      class="multiselect__clear"
                      @mousedown.prevent.stop="selectedCountryScope = null"
                    />
                  </template>
                </multiselect>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-sm-6 col-xs-12">
          <div class="form-group">
            <multiselect
              v-model="selectedOrganizationTypes"
              label="Title"
              track-by="OrganizationTypeUID"
              placeholder="Categories..."
              :options="organizationTypesOptions"
              :multiple="true"
              :searchable="true"
              :clear-on-select="false"
              :close-on-select="false"
            >
              <template slot="tag" slot-scope="{ option, remove }">
                <span class="custom__tag">
                  <span>{{ option.Title }}</span>
                  <span class="custom__remove" @click="remove(option)">&times;</span>
                </span>
              </template>
              <template slot="selection" slot-scope="{ values }">
                <span
                  v-if="values.length > 2"
                  class="multiselect__single"
                >{{ values.length }} categories selected</span>
              </template>
              <template slot="clear">
                <div
                  v-if="selectedOrganizationTypes.length"
                  class="multiselect__clear"
                  @mousedown.prevent.stop="selectedOrganizationTypes = null"
                />
              </template>
            </multiselect>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <ContactsList :base-query="query" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { readOnly } from '@roles'
import ContactsList from '@components/list/ContactsList'
import { BFormInput, BFormCheckbox } from 'bootstrap-vue'
import Multiselect from 'vue-multiselect'
import _ from 'lodash'

export default {
  name      : 'Contacts',
  components: {
    ContactsList,
    BFormInput,
    BFormCheckbox,
    Multiselect
  },
  data,
  computed: {
    query                    : buildQuery,
    meetingsOptions          : getMeetingsOptions,
    name                     : wrapQS('name',  { isArray: false }).get,
    isBroadSearch            : wrapQS('broad', { isArray: false, type: Boolean }),
    selectedOrganizations    : wrapQS('organization', { key: 'OrganizationUID',       find (v){ return this.organizationOptions.find(o => o.OrganizationUID == v.OrganizationUID) } }),
    selectedOrganizationTypes: wrapQS('types',        { key: 'OrganizationTypeUID',   find (v){ return this.organizationTypesOptions.find(o => o.OrganizationTypeUID == v.OrganizationTypeUID) } }),
    selectedCountries        : wrapQS('country',      { key: 'Code',                  find (v){ return this.countryOptions.find(o => o.Code == v.Code) } }),
    selectedMeetings         : wrapQS('meeting',      { key: 'EventUID',              find (v){ return this.events.find(o => o.EventUID == v.EventUID) } }),
    selectedFlags            : wrapQS('flag',         { key: 'value',                 find (v){ return this.flagOptions.find(o => o.value == v.value) } }),
    selectedCountryScope     : wrapQS('scope',        { key: 'value', isArray: false, find (v){ return this.scopeOptions.find(o => o.value == v.value) } }),
    selectedAttendances      : wrapQS('attendance',   { key: 'value', type: Number,   find (v){ return this.attendanceOptions.find(o => o.value == v.value) } }),
    ...mapGetters({
      countryOptions          : 'countries/list',
      organizationTypesOptions: 'organizations/types',
      selectedConference      : 'conferences/selected',
      majorEvents             : 'conferences/majorEvents',
      events                  : 'conferences/events'
    })
  },
  methods: {
    onNameTextChange        : _.debounce(wrapQS('name', { type: String }).set, 400),
    onOrganizationTextChange: _.debounce(searchOrganizations, 400),
    queryString
  },
  auth: readOnly
}

// ===================
//
// ===================
function data (){
  return {
    isLoadingOrganization: false,
    organizationOptions  : [],
    flagOptions          : [
      { name: 'Funded', value: 1 },
      { name: 'Priority', value: 2 }
    ],
    attendanceOptions: [
      { name: 'Nominated', value: 1 << 0, code: 'Nom' },
      { name: 'Accredited', value: 1 << 1, code: 'Acc' },
      { name: 'Registered', value: 1 << 2, code: 'Reg' }
    ],
    scopeOptions: [
      { name: 'Goverment', value: 'GOV' },
      { name: 'Country (Address)', value: 'CTR' }
    ]
  }
}

function getMeetingsOptions (){
  const now = new Date()

  const options = [ {
    title : 'Main meetings',
    events: _(this.events).filter(e => e.isMajor).orderBy([ 'StartDate', 'EndDate', 'Code' ], [ 'asc', 'desc', 'asc' ]).value()
  }, {
    title : 'Parallel meetings',
    events: _(this.events).filter(e => e.isMinor).orderBy([ 'StartDate', 'EndDate', 'Code' ], [ 'asc', 'desc', 'asc' ]).value()
  }, {
    title : 'Other future meetings',
    events: _(this.events).filter(e => !e.isMajor && !e.isMinor && new Date(e.EndDate) > now).orderBy([ 'StartDate', 'EndDate', 'Code' ], [ 'asc', 'desc', 'asc' ]).value()
  }, {
    title : 'Recent past meetings',
    events: _(this.events).filter(e => !e.isMajor && !e.isMinor && new Date(e.EndDate) <= now).orderBy([ 'EndDate', 'StartDate', 'Code' ], [ 'desc', 'asc', 'asc' ]).value()
  } ]

  return _.filter(options, o => o.events.length)
}

async function searchOrganizations (text){
  try {
    this.isLoadingOrganization = true
    let foundOrganizations = this.organizationOptions

    if (text){
      this.organizationOptions = this.selectedOrganizations
      foundOrganizations = await this.$kronosApi.getOrganizations({ FreeText: text, limit: 25 })
    }
    
    this.organizationOptions = _.unionBy(this.selectedOrganizations, foundOrganizations, o => o.OrganizationUID)
  }
  finally {
    this.isLoadingOrganization = false
  }
}
/*
async function selectOrganizations (organizationUIDs){
  if (organizationUIDs && organizationUIDs.length){
    this.organizationOptions = await this.$kronosApi.getOrganizations({
      OrganizationUIDs: asArray(organizationUIDs)
    })
    const uids = asArray(organizationUIDs)

    this.selectedOrganizations = this.organizationOptions.filter(o =>
      uids.includes(o.OrganizationUID)
    )
  }
  else {
    this.organizationOptions = []
    this.selectedOrganizations = []
  }
}*/

// ===================
// Build Query to pass to kronos api
// ===================
function buildQuery (){
  const query = cleanUp({
    FreeText               : this.name,
    IsBroadSearch          : this.isBroadSearch,
    //    IsFunded: todo
    Governments            : this.selectedCountries.map(o => o.Code),
    CountryScope           : (this.selectedCountryScope || {}).value,
    OrganizationUIDs       : this.selectedOrganizations.map(o => o.OrganizationUID),
    EventUIDs              : this.selectedMeetings.map(o => o.EventUID),
    EventRegistrationStatus: this.selectedAttendances.reduce((r, v) => r + v.value, 0)

  })

  if (!_.isEmpty(query)){
    query.StatusForEventUIDs = _(this.majorEvents.map(o => o.EventUID)).union(query.EventUIDs).compact().value()

    query.StatusForEventUID1 = query.StatusForEventUIDs[0] //backward compaty
    query.StatusForEventUID2 = query.StatusForEventUIDs[1]
    query.StatusForEventUID3 = query.StatusForEventUIDs[2]
    query.StatusForEventUID4 = query.StatusForEventUIDs[3]
  }

  return cleanUp(query)
}
function wrapQS (name, options){
  const {  key, find, type } = (options || {})
  let { isArray } = (options || { })

  isArray = isArray !== false

  return {
    get (){
      let values = asArray(this.queryString(name))

      if (type == Boolean) values = asArray(values).map(v => Boolean(v))
      if (type == Number)  values = asArray(values).map(v => Number(v))

      if (key)  values = values.map(v => ({ [key]: v }))
      if (find) values = values.map(v => find.call(this, v) || v)

      return isArray ? values : values[0]
    },
    set (values){
      values = asArray(values)

      if (key)
        values = values.map(o => o[key])

      this.queryString(name, values)
    }
  }
}

function queryString (name, value){
  if (value !== undefined){
    const params = { [name]: value }
    const newQueryString =  Object.assign({}, this.$route.query, params)

    this.$router.push({ query: newQueryString })
  }

  return this.$route.query[name]
}

function asArray (data){
  return _([ data ])
    .flatten()
    .compact()
    .value()
}

function cleanUp (obj){
  return _(obj).omitBy(v =>
    (_.isNil(v)) ||
    (_.isString(v) && _.isEmpty(v)) ||
    (_.isObject(v) && _.isEmpty(v)) ||
    (_.isArray(v)  && _.isEmpty(v))
  ).value()
}
</script>
