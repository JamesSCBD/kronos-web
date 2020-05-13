<template>
  <div class="container-fluid">
    <div class="card">
      <div class="card-header">
        <strong>Filter</strong>
        <div class="card-header-actions">
          <CLink
            class="card-header-action btn-minimize"
            @click="filterFormCollapsed=!filterFormCollapsed"
          >
            <i :class="{ 'cil-chevron-top': filterFormCollapsed, 'cil-chevron-bottom': !filterFormCollapsed }" />
          </CLink>
        </div>
      </div>
      <div v-if="filterFormCollapsed" class="card-body filter_Sec">
        <div class="row">
          <div class="col-md-6 col-sm-6 col-xs-12">
            <div class="form-group">
              <div class="input-group mb-3">
                <BFormInput
                  id="filterInput"
                  v-model="freeText"
                  type="search"
                  placeholder="Name / Acronym / #KEYWORD"
                />
                <div class="input-group-append">
                  <span class="input-group-text">
                    <span class="badge" :class="{ 'badge-success' : isBroadSearch }">Broad</span>
                    <BFormCheckbox v-model="isBroadSearch" />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-sm-6 col-xs-12">
            <div class="row">
              <div class="col-7 pr-0">
                <div class="form-group">
                  <EventSelector v-model="selectedEvents" />
                </div>
              </div>
              <div class="col-5 pl-0">
                <div class="form-group">
                  <RegistrationStatusSelector v-model="selectedAttendances" :disabled="!selectedEvents.length" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 col-sm-6 col-xs-12">
            <div class="form-group">
              <OrganizationTypeSelector v-model="selectedOrganizationTypes" />
            </div>
          </div>
          <div class="col-md-6 col-sm-6 col-xs-12">
            <div class="form-group">
              <multiselect
                v-model="selectedValidationStatus"
                label="Title"
                track-by="Value"
                placeholder="Status"
                :options="validationStatusOptions"
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
              <div class="col-7 pr-0">
                <div class="form-group">
                  <CountrySelector v-model="selectedCountries" />
                </div>
              </div>
              <div class="col-5 pl-0">
                <div class="form-group">
                  <CountryScopeSelector v-model="selectedCountryScope" :disabled="!selectedCountries.length" />
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-sm-6 col-xs-12" />
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <OrganizationsList :base-query="query" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { readOnly } from '@roles';
import { BFormInput, BFormCheckbox } from 'bootstrap-vue';
import Multiselect from 'vue-multiselect';
import _ from 'lodash';
import { CLink } from '@coreui/vue';
import OrganizationsList from '~/components/list/OrganizationsList';
import EventSelector from '~/components/controls/selectors/EventSelector';
import RegistrationStatusSelector from '~/components/controls/selectors/RegistrationStatusSelector';
import OrganizationTypeSelector from '~/components/controls/selectors/OrganizationTypeSelector';
import CountrySelector from '~/components/controls/selectors/CountrySelector';
import CountryScopeSelector from '~/components/controls/selectors/CountryScopeSelector';

const validationStatus = [
  { Title: 'Validated', Value: 'true' },
  { Title: 'Not Validated', Value: 'false' },
];

export default {
  name      : 'Organizations',
  components: {
    OrganizationsList,
    BFormInput,
    BFormCheckbox,
    Multiselect,
    EventSelector,
    RegistrationStatusSelector,
    OrganizationTypeSelector,
    CountrySelector,
    CountryScopeSelector,
    CLink,
  },
  data() {
    return {
      filterFormCollapsed: true,
    };
  },
  computed: {
    query                    : buildQuery,
    freeText                 : { get: getFreeText, set: _.debounce(setFreeText, 400) },
    isBroadSearch            : { get: getBroadSearch, set: setBroadSearch },
    selectedEvents           : { get: getSelectedEvents, set: setSelectedEvents },
    selectedAttendances      : { get: getSelectedAttendances, set: setSelectedAttendances },
    selectedOrganizationTypes: { get: getSelectedOrganizationTypes, set: setSelectedOrganizationTypes },
    selectedCountries        : { get: getSelectedCountries, set: setSelectedCountries },
    selectedCountryScope     : { get: getSelectedCountryScope, set: setSelectedCountryScope },
    selectedValidationStatus : { get: getSelectedValidationStatus, set: setSelectedValidationStatus },
    validationStatusOptions  : { get: () => validationStatus },
    ...mapGetters({
      majorEvents: 'conferences/majorEvents',
    }),
  },
  methods: {
    queryString,
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

  return [ 'true', '1', true, 1 ].includes(value);
}

function setBroadSearch(values) {
  const value = asArray(values)[0];

  this.queryString('broad', value || null);
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

// ///////////////
// Attendances //
// //////////////

function getSelectedAttendances() {
  return asArray(this.queryString('attendance')).map((i) => Number(i)) || null;
}

function setSelectedAttendances(values) {
  const ids = asArray(values) || null;
  this.queryString('attendance', ids);
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
  return asArray(this.queryString('scope'))[0] || null;
}

function setSelectedCountryScope(value) {
  const codes = asArray(value) || null;

  this.queryString('scope', codes);
}

// ////////////////////
// Validation Status //
// ///////////////////

function getSelectedValidationStatus() {
  const value = asArray(this.queryString('status')) || null;
  return value.map((x) => this.validationStatusOptions.find((c) => c.Value === x) || { Value: value, isMissing: true });
}

function setSelectedValidationStatus(value) {
  const values = asArray(value).map((o) => o.Value);

  this.queryString('status', values);
}

// ===================
// Build Query to pass to kronos api
// ===================
function buildQuery() {
  const query = cleanUp({
    FreeText   : this.freeText,
    EventUIDs  : this.selectedEvents,
    TypeUIDs   : this.selectedOrganizationTypes,
    Governments: this.selectedCountries,
    IsValidated: (this.selectedValidationStatus[0] || {}).Value,
  });

  if (query.FreeText) query.IsBroadSearch = this.isBroadSearch || undefined;
  if (query.EventUIDs) query.EventRegistrationStatus = this.selectedAttendances.reduce((r, v) => r + v, 0) || undefined;
  if (query.Governments) query.CountryScope = (this.selectedCountryScope || undefined);

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
