<template>
  <multiselect
    v-model="selectedOrganizationTypes"
    label="Title"
    track-by="OrganizationTypeUID"
    placeholder="Categories..."
    :options="organizationTypesOptions"
    :multiple="multiple"
    :searchable="true"
    :clear-on-select="false"
    :close-on-select="!multiple"
  >
    <template slot="option" slot-scope="props">
      <span>{{ props.option.Title }} (<b>{{ props.option.Acronym }}</b>)</span>
    </template>
    <template slot="tag" slot-scope="{ option, remove }">
      <span class="multiselect__tag">
        <span>{{ option.Acronym || option.Title }}</span>
        <i aria-hidden="true" tabindex="1" class="multiselect__tag-icon" @click="remove(option)" />
      </span>
    </template>
    <template slot="selection" slot-scope="{ values }">
      <span
        v-if="values.length > 3"
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
</template>

<script>
import Multiselect from 'vue-multiselect';
import { mapGetters } from 'vuex';
import SelectorsMixin  from './SelectorsMixin';

export default {
  name      : 'OrganizationTypeSelector',
  components: {    Multiselect  },
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
    selectedOrganizationTypes: {
      get() {
        return this.asArray(this.value)
          .map((value) => this.organizationTypesOptions
            .find((option) => option.OrganizationTypeUID === value) || { OrganizationTypeUID: value, isMissing: true });
      },
      set(orgTypes) {
        const ids = this.asArray(orgTypes).map((orgType) => orgType.OrganizationTypeUID);
        this.$emit('input', this.multiple ? ids : ids[0]);
      },
    },
    ...mapGetters({ organizationTypesOptions: 'organizations/types' }),
  },
};
</script>

<style>

</style>
