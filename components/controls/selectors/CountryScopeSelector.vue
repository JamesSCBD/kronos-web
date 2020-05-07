<template>
  <div>
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
      :disabled="disabled"
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
</template>
<script>
import Multiselect from 'vue-multiselect';
import _ from 'lodash';

const CountryScopes = [
  { Title: 'Goverment', Code: 'GOV' },
  { Title: 'Country (Address)', Code: 'CTR' },
];

export default {
  name      : 'CountryScopeSelector',
  components: { Multiselect },
  props     : {
    value: {
      type   : String,
      default: null,
      validator(value) {
        return CountryScopes.some((o) => o.Code === value);
      },
    },
    disabled: {
      type   : Boolean,
      default: false,
    },
  },
  computed: {
    selectedCountryScope: {
      get() {
        return asArray(this.value).map((value) => this.countryScopeOptions.find((option) => option.Code === value) || { Code: value, isMissing: true });
      },
      set(countryScopes) {
        const codes = asArray(countryScopes).map((countryScope) => countryScope.Code);
        this.$emit('input', codes[0]);
      },
    },
    countryScopeOptions: { get: () => CountryScopes },
  },
  watch: { disabled(value) { if (value) this.selectedCountryScope = null; } },
};

function asArray(data) {
  return _([ data ])
    .flatten()
    .compact()
    .value();
}
</script>
