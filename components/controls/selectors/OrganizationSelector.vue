<template>
  <div>
    <multiselect
      v-model="selectedOrganizations"
      label="OrganizationName"
      track-by="OrganizationUID"
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
          .map((value) => this.getCachedOrganizationById(value) || { OrganizationUID: value, isMissing: true });
      },
      set(organizations) {
        const ids = this.asArray(organizations).map((organization) => organization.OrganizationUID);
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
      const response           = await this.queryOrganizations({ FreeText: text, limit: 25 });
      foundOrganizations       = response.records;
    }

    this.organizationOptions = _.unionBy(this.selectedOrganizations, foundOrganizations, (o) => o.OrganizationUID);
  } finally {
    this.isLoadingOrganization = false;
  }
}

async function initOrganizationCache() {
  const missingOrganizations = this.selectedOrganizations.filter((o) => o.isMissing);

  if (missingOrganizations.length) {
    const response           = await this.queryOrganizations({ OrganizationUIDs: missingOrganizations.map((o) => o.OrganizationUID) });
    this.organizationOptions = response.records;
  }
}
</script>
