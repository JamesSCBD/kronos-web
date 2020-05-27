<template>
  <div>
    <multiselect
      v-model="selectedOrganizations"
      label="name"
      track-by="organizationId"
      placeholder="Search organization"
      open-direction="bottom"
      :options="organizationOptions"
      :multiple="multiple"
      :searchable="true"
      :loading="isLoadingOrganization"
      :internal-search="false"
      :clear-on-select="false"
      :close-on-select="!multiple"
      :max-height="300"
      @search-change="onOrganizationTextChange"
    >
      <template slot="option" slot-scope="props">
        <span class="float-right">{{ props.option.score }}</span>
        <span>{{ props.option.name }}</span>
        <b v-if="props.option.acronym">{{ props.option.acronym }}</b>
        <i v-if="props.option.memberCount>=0">({{ props.option.memberCount }})</i>
      </template>
      <template slot="tag" slot-scope="{ option, remove }">
        <span class="multiselect__tag">
          <span>{{ option.acronym || option.name }}</span>
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
</template>

<script>
import Multiselect from 'vue-multiselect';
import { mapGetters, mapActions } from 'vuex';
import _ from 'lodash';
import SelectorsMixin  from './SelectorsMixin';

export default {
  name      : 'OrganizationSelector',
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
  data() {
    return {
      isLoadingOrganization: false,
      organizationOptions  : [],
    };
  },
  computed: {
    selectedOrganizations: {
      get() {
        return this.asArray(this.value)
          .map((value) => this.getCachedOrganizationById(value) || { organizationId: value, isMissing: true });
      },
      set(organizations) {
        const ids = this.asArray(organizations).map((organization) => organization.organizationId);
        this.$emit('input', this.multiple ? ids : ids[0]);
      },
    },
    ...mapGetters({ getCachedOrganizationById: 'organizations/getOrganizationById' }),
  },
  created() { initOrganizationCache.call(this); },
  methods: {
    onOrganizationTextChange: _.debounce(searchOrganizations, 400),
    ...mapActions({ queryOrganizations: 'organizations/queryOrganizations' }),
  },
};

async function searchOrganizations(text) {
  try {
    this.isLoadingOrganization = true;
    let foundOrganizations     = this.organizationOptions;

    if (text) {
      this.organizationOptions = this.selectedOrganizations;
      const response           = await this.queryOrganizations({ freeText: text, limit: 25 });
      foundOrganizations       = response.records;
    }

    this.organizationOptions = _.unionBy(this.selectedOrganizations, foundOrganizations, (o) => o.organizationId);
  } finally {
    this.isLoadingOrganization = false;
  }
}

async function initOrganizationCache() {
  const missingOrganizations = this.selectedOrganizations.filter((o) => o.isMissing);

  if (missingOrganizations.length) {
    const response           = await this.queryOrganizations({ organizationIds: missingOrganizations.map((o) => o.organizationId) });
    this.organizationOptions = response.records;
  }
}
</script>
