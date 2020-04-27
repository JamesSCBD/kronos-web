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
                  v-model="freeText"
                  type="search"
                  placeholder="Name / Barcode / #tags"
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
                <EventSelector v-model="selectedEvents" />
              </div>
            </div>
            <div class="col-md-5 col-sm-5 col-xs-12 pl-0">
              <div class="form-group">
                <multiselect
                  v-model="selectedAttendances"
                  label="Title"
                  track-by="Value"
                  placeholder="Attendance "
                  open-direction="bottom"
                  :options="attendanceOptions"
                  :multiple="true"
                  :clear-on-select="false"
                  :close-on-select="false"
                  :show-no-results="false"
                >
                  <template slot="tag" slot-scope="{ option, remove }">
                    <span class="multiselect__tag">
                      <span>{{ option.Title.substr(0,3) }}</span>
                      <i aria-hidden="true" tabindex="1" class="multiselect__tag-icon" @click="remove(option)" />
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
                <span class="multiselect__tag">
                  <span>{{ option.OrganizationAcronym || option.OrganizationName }}</span>
                  <i aria-hidden="true" tabindex="1" class="multiselect__tag-icon" @click="remove(option)" />
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
              label="Title"
              track-by="Code"
              placeholder="Special Flags..."
              :options="flagOptions"
              :multiple="true"
              :searchable="false"
              :clear-on-select="false"
              :close-on-select="false"
            >
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
                <CountrySelector v-model="selectedCountries" />
              </div>
            </div>
            <div class="col-md-5 col-sm-6 col-xs-12 pl-0">
              <div class="form-group">
                <multiselect
                  v-model="selectedCountryScope"
                  label="Title"
                  track-by="Code"
                  placeholder="Scope"
                  :options="countryScopeOptions"
                  :multiple="false"
                  :searchable="false"
                  :clear-on-select="false"
                  :close-on-select="true"
                >
                  <template slot="clear">
                    <div
                      v-if="selectedCountryScope.Code"
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
            <OrganizationTypeSelector v-model="selectedOrganizationTypes" />
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
import { mapGetters, mapActions } from 'vuex';
import { readOnly } from '@roles';
import { BFormInput, BFormCheckbox } from 'bootstrap-vue';
import Multiselect from 'vue-multiselect';
import _ from 'lodash';
import ContactsList from '~/components/list/ContactsList';
import EventSelector from '~/components/controls/selectors/EventSelector';
import CountrySelector from '~/components/controls/selectors/CountrySelector';
import OrganizationTypeSelector from '~/components/controls/selectors/OrganizationTypeSelector';


const Flags = [
  { Title: 'Funded', Code: 'funded' },
];

const Attendances   = [
  { Title: 'Nominated',  Value: 1 << 0 }, // eslint-disable-line no-bitwise
  { Title: 'Accredited', Value: 1 << 1 }, // eslint-disable-line no-bitwise
  { Title: 'Registered', Value: 1 << 2 }, // eslint-disable-line no-bitwise
];
const CountryScopes = [
  { Title: 'Goverment', Code: 'GOV' },
  { Title: 'Country (Address)', Code: 'CTR' },
];

export default {
  name      : 'Contacts',
  components: {
    ContactsList,
    BFormInput,
    BFormCheckbox,
    Multiselect,
    EventSelector,
    CountrySelector,
    OrganizationTypeSelector,
  },
  data() {
    return {
      isLoadingOrganization: false,
      organizationOptions  : [],
    };
  },
  computed: {
    query                    : buildQuery,
    freeText                 : { get: getFreeText, set: _.debounce(setFreeText, 400) },
    isBroadSearch            : { get: getBroadSearch, set: setBroadSearch },
    selectedCountries        : { get: getSelectedCountries, set: setSelectedCountries },
    selectedCountryScope     : { get: getSelectedCountryScope, set: setSelectedCountryScope },
    selectedOrganizations    : { get: getSelectedOrganizations, set: setSelectedOrganizations },
    selectedOrganizationTypes: { get: getSelectedOrganizationTypes, set: setSelectedOrganizationTypes },
    selectedEvents           : { get: getSelectedEvents, set: setSelectedEvents },
    selectedFlags            : { get: getSelectedFlags, set: setSelectedFlags },
    selectedAttendances      : { get: getSelectedAttendances, set: setSelectedAttendances },
    flagOptions              : { get: () => Flags },
    attendanceOptions        : { get: () => Attendances },
    countryScopeOptions      : { get: () => CountryScopes },
    ...mapGetters({
      countryOptions               : 'countries/list',
      selectedConference           : 'conferences/selected',
      majorEvents                  : 'conferences/majorEvents',
      getCachedEventById           : 'conferences/getEventById',
      getCachedCountryByCode       : 'countries/getCountryByCode',
      getCachedOrganizationById    : 'organizations/getOrganizationById',
      getCachedOrganizationTypeById: 'organizations/getTypeById',
    }),
  },
  created() {
    initOrganizationCache.call(this);
  },
  methods: {
    onOrganizationTextChange: _.debounce(searchOrganizations, 400),
    queryString,
    ...mapActions({
      getOrganizations: 'organizations/getOrganizations',
    }),
  },
  auth: readOnly,
};

// /////////////
// FreeText //
// ////////////
function getFreeText() {
  const text = asArray(this.queryString('text'))[0];

  return text || '';
}

function setFreeText(values) {
  const text = asArray(values)[0] || '';

  this.queryString('text', text);
}

// ///////////////
// BroadSearch //
// ///////////////
function getBroadSearch() {
  const value = asArray(this.queryString('broad'))[0];

  return [ 'true', '1' ].includes(value);
}

function setBroadSearch(values) {
  const value = asArray(values)[0];

  this.queryString('broad', value || null);
}

// /////////////
// Countries //
// /////////////

function getSelectedCountries() {
  return asArray(this.queryString('country')) || null;
}

function setSelectedCountries(values) {
  const codes = asArray(values) || null;

  this.queryString('country', codes);
}

function getSelectedCountryScope() {
  const code = asArray(this.queryString('scope'))[0];

  return this.countryScopeOptions.find((c) => c.Code === code) || { Code: code, isMissing: true };
}

function setSelectedCountryScope(value) {
  const codes = asArray(value).map((o) => o.Code);

  this.queryString('scope', codes);
}

// ////////////////
// organization //
// ////////////////

function getSelectedOrganizationTypes() {
  return asArray(this.queryString('type')) || null;
}

function setSelectedOrganizationTypes(values) {
  const ids = asArray(values) || null;

  this.queryString('type', ids);
}

function getSelectedOrganizations() {
  const ids = asArray(this.queryString('organization'));

  return ids.map((id) => this.getCachedOrganizationById(id) || { OrganizationUID: id, isMissing: true });
}

function setSelectedOrganizations(values) {
  const ids = asArray(values).map((o) => o.OrganizationUID);

  this.queryString('organization', ids);
}

async function searchOrganizations(text) {
  try {
    this.isLoadingOrganization = true;
    let foundOrganizations     = this.organizationOptions;

    if (text) {
      this.organizationOptions = this.selectedOrganizations;
      foundOrganizations       = await this.getOrganizations({ FreeText: text, limit: 25 });
    }

    this.organizationOptions = _.unionBy(this.selectedOrganizations, foundOrganizations, (o) => o.OrganizationUID);
  } finally {
    this.isLoadingOrganization = false;
  }
}

async function initOrganizationCache() {
  const missingOrganizations = this.selectedOrganizations.filter((o) => o.isMissing);

  if (missingOrganizations.length) {
    this.organizationOptions = await this.getOrganizations({ OrganizationUIDs: missingOrganizations.map((o) => o.OrganizationUID) });
  }
}

// /////////
// Flags //
// /////////

function getSelectedFlags() {
  const codes = asArray(this.queryString('flag'));

  return codes.map((code) => this.flagOptions.find((o) => o.Code === code) || { Code: code, isMissing: true });
}

function setSelectedFlags(values) {
  const codes = asArray(values).map((o) => o.Code);

  this.queryString('flag', codes);
}

// ///////////////
// Attendances //
// //////////////

function getSelectedAttendances() {
  const ids = asArray(this.queryString('attendance'));

  return ids.map((id) => this.attendanceOptions.find((o) => o.Value === id) || { Value: id, isMissing: true });
}

function setSelectedAttendances(values) {
  const ids = asArray(values).map((o) => o.Value);

  this.queryString('attendance', ids);
}

// ////////////
// Meetings //
// ////////////
function getSelectedEvents() {
  return asArray(this.queryString('event')) || null;
}

function setSelectedEvents(values) {
  const ids = asArray(values) || null;

  this.queryString('event', ids);
}

// ===================
// Build Query to pass to kronos api
// ===================
function buildQuery() {
  const query = cleanUp({
    FreeText               : this.freeText,
    Governments            : this.selectedCountries,
    OrganizationUIDs       : this.selectedOrganizations.map((o) => o.OrganizationUID),
    EventUIDs              : this.selectedEvents,
    EventRegistrationStatus: this.selectedAttendances.reduce((r, v) => r + v.value, 0) || undefined,
  });

  if (query.FreeText) { query.IsBroadSearch = this.isBroadSearch || undefined; }
  if (query.Governments) { query.CountryScope = (this.selectedCountryScope || {}).value; }

  if (this.selectedFlags.some((o) => o.Code === 'funded')) { query.IsFunded = true; }

  if (!_.isEmpty(cleanUp(query))) {
    query.StatusForEventUIDs = _(this.majorEvents.map((o) => o.EventUID)).union(query.EventUIDs).compact().value();

    [ query.StatusForEventUID1,
      query.StatusForEventUID2,
      query.StatusForEventUID3,
      query.StatusForEventUID4 ] = query.StatusForEventUIDs; // backward compatibility
  }

  return cleanUp(query);
}

function queryString(name, value) {
  if (value !== undefined) {
    const params         = { [name]: value || undefined };
    const newQueryString = { ...this.$route.query, ...params };

    this.$router.push({ query: newQueryString });
  }

  return this.$route.query[name];
}

function asArray(data) {
  return _([ data ])
    .flatten()
    .compact()
    .value();
}

function cleanUp(obj) {
  return _(obj).omitBy((v) => (_.isNil(v))
    || (_.isString(v) && _.isEmpty(v))
    || (_.isObject(v) && _.isEmpty(v))
    || (_.isArray(v) && _.isEmpty(v))).value();
}
</script>
