<template>
  <div>
    <multiselect
      v-model="selectedCountries"
      label="name"
      track-by="code"
      placeholder="Country"
      :options="countryOptions"
      :multiple="multiple"
      :searchable="true"
      :clear-on-select="false"
      :close-on-select="!multiple"
    >
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
</template>

<script>
import { mapGetters } from 'vuex';
import Multiselect from 'vue-multiselect';
import SelectorsMixin  from './SelectorsMixin';

export default {
  name      : 'CountrySelector',
  components: { Multiselect },
  mixins    : [ SelectorsMixin ],
  props     : {
    value: {
      type    : [ String, Array ],
      required: true,
      default() {
        return [];
      },
    },
  },
  computed: {
    selectedCountries: {
      get() {
        return this.asArray(this.value).map((value) => this.countryOptions.find((option) => option.code === value) || { code: value, isMissing: true });
      },
      set(countries) {
        const codes = this.asArray(countries).map((country) => country.code);
        this.$emit('input', this.multiple ? codes : codes[0]);
      },
    },
    ...mapGetters({
      countryOptions: 'countries/list',
    }),
  },
};
</script>
