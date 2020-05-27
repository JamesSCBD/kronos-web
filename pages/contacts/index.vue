<template>
  <div class="container-fluid">
    <div class="card">
      <div class="card-header">
        <strong>Filter</strong>
        <div class="card-header-actions">
          <button
            class="card-header-action btn"
            title="Use current search as contact selection"
            :disabled="!canSaveQuery"
            @click="setSelectedQuery(query)"
          >
            <i class="cil-task " />
          </button>
          <CLink class="card-header-action btn-minimize" @click="filterFormCollapsed=!filterFormCollapsed">
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
                  placeholder="Name / Barcode / #tags"
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
              <OrganizationSelector v-model="selectedOrganizations" />
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
          <div class="col-md-6 col-sm-6 col-xs-12">
            <div class="form-group">
              <OrganizationTypeSelector v-model="selectedOrganizationTypes" />
            </div>
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
import { CLink } from '@coreui/vue';
import ContactsList from '~/components/list/ContactsList';
import EventSelector from '~/components/controls/selectors/EventSelector';
import CountrySelector from '~/components/controls/selectors/CountrySelector';
import OrganizationSelector from '~/components/controls/selectors/OrganizationSelector';
import OrganizationTypeSelector from '~/components/controls/selectors/OrganizationTypeSelector';
import RegistrationStatusSelector from '~/components/controls/selectors/RegistrationStatusSelector';
import CountryScopeSelector from '~/components/controls/selectors/CountryScopeSelector';


const Flags = [
  { Title: 'Funded', Code: 'funded' },
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
    OrganizationSelector,
    OrganizationTypeSelector,
    RegistrationStatusSelector,
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
    selectedCountries        : { get: getSelectedCountries, set: setSelectedCountries },
    selectedCountryScope     : { get: getSelectedCountryScope, set: setSelectedCountryScope },
    selectedOrganizations    : { get: getSelectedOrganizations, set: setSelectedOrganizations },
    selectedOrganizationTypes: { get: getSelectedOrganizationTypes, set: setSelectedOrganizationTypes },
    selectedEvents           : { get: getSelectedEvents, set: setSelectedEvents },
    selectedFlags            : { get: getSelectedFlags, set: setSelectedFlags },
    selectedAttendances      : { get: getSelectedAttendances, set: setSelectedAttendances },
    flagOptions              : { get: () => Flags },
    canSaveQuery() { return !_.isEmpty(this.query); },
    ...mapGetters({
      majorEvents: 'conferences/majorEvents',
    }),
  },
  methods: {
    queryString,
    ...mapActions({
      setSelectedQuery: 'contacts/setSelectedQuery',
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

  return [ 'true', '1', true, 1 ].includes(value);
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
  return asArray(this.queryString('scope'))[0] || null;
}

function setSelectedCountryScope(value) {
  const codes = asArray(value) || null;

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
  return asArray(this.queryString('organization')) || null;
}

function setSelectedOrganizations(values) {
  const ids = asArray(values) || null;

  this.queryString('organization', ids);
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
  return asArray(this.queryString('attendance')).map((i) => Number(i)) || null;
}

function setSelectedAttendances(values) {
  const ids = asArray(values) || null;
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
    freeText         : this.freeText,
    countries        : this.selectedCountries,
    organizationIds  : this.selectedOrganizations,
    eventIds         : this.selectedEvents,
    organizationTypes: this.selectedOrganizationTypes,
  });

  if (query.freeText) query.isBroadSearch = this.isBroadSearch || undefined;
  if (query.eventIds) query.registrationStatus = this.selectedAttendances.reduce((r, v) => r + v, 0) || undefined;
  if (query.countries) query.countryScope = (this.selectedCountryScope || undefined);

  if (this.selectedFlags.some((o) => o.Code === 'funded')) query.isFunded = true;

  if (!_.isEmpty(cleanUp(query))) query.registrationStatusForEventIds = _(this.majorEvents.map((o) => o.eventId)).union(query.eventIds).compact().value();

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
