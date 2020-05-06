<template>
  <div>
    <pager
      :page.sync="page"
      :page-size.sync="pageSize"
      :record-count="totalRows"
      :sync-query-string="true"
    />
    <BTable
      id="KOrganizationList"
      :items="searchOrganizations"
      :fields="columns"
      :busy="loading"
      class="mb-0 table-outline list"
      responsive="md"
      hover
      head-variant="light"
      sort-icon-left
      :per-page="pageSize"
      :current-page="page"
      :filter="baseQuery"
    >
      <!-- https://bootstrap-vue.js.org/docs/components/table#scoped-field-slots -->

      <template v-slot:table-busy>
        <div class="text-center text-danger my-2">
          <CIcon name="circleNotch" class="fa-spin fa-3x fa-fw" />
          <strong>Loading...</strong>
        </div>
      </template>
      <template v-slot:head(Selected)>
        <BFormCheckbox
          v-model="isAllSelected"
          :indeterminate="isPartialySelected"
          @change="onSelectedAll"
        />
      </template>
      <template v-slot:cell(Selected)="data">
        <BFormCheckbox v-model="data.item.Selected" @change="onSelected(data.item)" />
      </template>
      <template v-slot:cell(Country)="{value}">
        <CountryCol v-if="value" :code="value" />
      </template>

      <template v-slot:cell(Government)="{value}">
        <CountryCol v-if="value" :code="value" />
      </template>

      <template v-slot:cell(OrganizationTypeUID)="{value}">
        <OrganizationTypeCol v-if="value" :organization-type-id="value" />
      </template>

      <template v-slot:cell(IsValidated)="{value}">
        {{ value ? 'Yes': 'No' }}
      </template>
    </BTable>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters, mapActions } from 'vuex';
import mixin from './mixin';
import pager from '~/components/controls/Pager';

const baseColumns = [
  { key: 'Selected', label: '', sortable: false },
  { key: 'OrganizationName', label: 'Organization', sortable: true },
  { key: 'OrganizationAcronym', label: 'Acronym', sortable: true },
  { key: 'OrganizationTypeUID', label: 'Type', sortable: true },
  { key: 'Government', label: 'Government', sortable: true },
  { key: 'IsValidated', label: 'Validated', sortable: true },
  { key: 'MemberCount', label: 'Member Count', sortable: true },
  {
    key: 'Country', label: 'Country', class: 'text-center', sortable: true,
  },
  { key: 'Code', label: 'ID', sortable: true },
  { key: 'Score', label: 'Rank', sortable: true },
];

export default {
  name      : 'OrganizationsList',
  components: { pager },
  mixins    : [ mixin ],
  props     : {
    baseQuery: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      loading      : false,
      columns      : [ ...baseColumns ],
      totalRows    : 0,
      page         : 1,
      pageSize     : 25,
      organizations: [],
    };
  },
  computed: {
    isAllSelected() {
      return this.organizations.every((o) => this.isOrganizationSelected(o.OrganizationUID)) && this.organizations.length > 0;
    },
    isPartialySelected() {
      return (this.organizations.some((o) => this.isOrganizationSelected(o.OrganizationUID)) && !this.isAllSelected);
    },
    selectedOrganizations() {
      return this.organizations.filter((o) => this.isOrganizationSelected(o.OrganizationUID));
    },
    notSelectedOrganizations() {
      return this.organizations.filter((o) => !this.isOrganizationSelected(o.OrganizationUID));
    },
    ...mapGetters({
      isOrganizationSelected: 'organizations/isOrganizationSelected',
    }),
  },
  methods: {
    searchOrganizations,
    buildQuery,
    onSelected,
    onSelectedAll,
    ...mapActions({
      addToSelection     : 'organizations/addToSelection',
      removeFromSelection: 'organizations/removeFromSelection',
    }),
  },
};

//= ================================
//
//= ================================
async function searchOrganizations() {
  try {
    this.loading       = true;
    this.organizations = [];

    const query = this.buildQuery();

    if (!query) return [];

    const response = await this.$kronosApi.queryOrganizations(query);

    this.totalRows = response.totalRecordCount;
    const rows     = response.records;

    const thisComponent = this;

    this.organizations =  rows.map((r) => ({
      ...r,
      get Selected() {
        return thisComponent.isOrganizationSelected(this.OrganizationUID);
      },
    }));
    return this.organizations;
  } finally {
    this.loading = false;
  }
}

//= ================================
//
//= ================================
function buildQuery() {
  const query = _(this.baseQuery || {}).omitBy(_.isNil).value();

  if (_.isEmpty(query)) { return null; }

  const limit = this.pageSize;
  const skip  = this.pageSize * (this.page - 1);

  if (limit) { query.limit = limit; }
  if (skip) { query.skip = skip; }

  // todo sort

  return query;
}

function onSelected(item) {
  const organization = cleanOrganization(item);

  if (this.isOrganizationSelected(organization.OrganizationUID)) {
    this.removeFromSelection(organization);
  } else {
    this.addToSelection(organization);
  }
}

function onSelectedAll() {
  if (this.isAllSelected) {
    this.selectedOrganizations.forEach((o) => this.removeFromSelection(cleanOrganization(o)));
  } else {
    this.notSelectedOrganizations.forEach((o) => this.addToSelection(cleanOrganization(o)));
  }
}

function cleanOrganization(item) {
  const { Selected, ...organization } = item;

  return organization;
}

</script>
<style scoped>
.list {
  width: 100%;
}
</style>
