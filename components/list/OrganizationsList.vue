<template>
  <div>
    <pager
      :page.sync="page"
      :page-size.sync="pageSize"
      :record-count="totalRows"
      :sync-query-string="true"
      :show-record-count="false"
      class=" float-right"
    />
    <CDropdown
      :toggler-text="totalRecords"
      class=" float-right mr-2"
      color="outline-dark"
      :disabled="!isQueryEmpty"
    >
      <CDropdownItem v-for="task in tasks" :key="task.name" @click="getSelectedContactsResult(task)">
        <CIcon :name="task.taskAttributes.icon" class="pr-1" />
        {{ task.taskAttributes.caption }}
      </CDropdownItem>
    </CDropdown>
    <BTable
      id="KOrganizationList"
      ref="organizationTable"
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
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      no-sort-reset
    >
      <!-- https://bootstrap-vue.js.org/docs/components/table#scoped-field-slots -->

      <template v-slot:table-busy>
        <div class="text-center text-danger my-2">
          <CIcon name="circleNotch" class="fa-spin fa-3x fa-fw" />
          <strong>Loading...</strong>
        </div>
      </template>
      <template v-slot:head(selected)>
        <BFormCheckbox
          :checked="isAllSelected"
          :indeterminate="isPartialySelected"
          @change="onSelectedAll"
        />
      </template>
      <template v-slot:cell(selected)="data">
        <BFormCheckbox v-model="data.item.selected" @change="onSelected(data.item)" />
      </template>
      <template v-slot:cell(country)="{value}">
        <CountryCol v-if="value" :code="value" />
      </template>

      <template v-slot:cell(government)="{value}">
        <CountryCol v-if="value" :code="value" />
      </template>

      <template v-slot:cell(organizationTypeId)="{value}">
        <OrganizationTypeCol v-if="value" :organization-type-id="value" />
      </template>

      <template v-slot:cell(isValidated)="{value}">
        {{ value ? 'Yes': 'No' }}
      </template>
    </BTable>
    <!-- Modal Component -->
    <CModal
      v-if="activeTask"
      :title="activeTask.taskAttributes.title || activeTask.taskAttributes.caption"
      :show.sync="showModal"
      :close-on-backdrop="false"
      :size="activeTask.taskAttributes.size || 'lg'"
    >
      <component :is="activeTask.name" :selected-result="selectedContactResult" @close="showModal = false" />
      <template #footer-wrapper>
        <div />
      </template>
    </CModal>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters, mapActions } from 'vuex';
import { CModal, CDropdown, CDropdownItem } from '@coreui/vue';
import mixin from './mixin';
import pager from '~/components/controls/Pager';
import BatchTasks, { taskHasContexts }  from '~/components/batch-tasks';

const baseColumns = [
  { key: 'selected', label: '', sortable: false },
  { key: 'name', label: 'Organization', sortable: true },
  { key: 'acronym', label: 'Acronym', sortable: true },
  { key: 'organizationTypeId', label: 'Type', sortable: true },
  { key: 'government', label: 'Government', sortable: true },
  { key: 'isValidated', label: 'Validated', sortable: true },
  { key: 'memberCount', label: 'Member Count', sortable: true },
  {
    key: 'country', label: 'Country', class: 'text-center', sortable: true,
  },
  { key: 'code', label: 'ID', sortable: false },
  { key: 'score', label: 'Rank', sortable: false },
];

export default {
  name      : 'OrganizationsList',
  components: {
    pager, CModal, ...BatchTasks, CDropdown, CDropdownItem,
  },
  mixins: [ mixin ],
  props : {
    baseQuery: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      loading              : false,
      columns              : [ ...baseColumns ],
      totalRows            : null,
      page                 : 1,
      pageSize             : 25,
      organizations        : [],
      sortBy               : 'name',
      sortDesc             : false,
      activeTask           : null,
      selectedContactResult: {},
    };
  },
  computed: {
    isAllSelected() {
      return this.organizations.every((o) => this.isOrganizationSelected(o.organizationId)) && this.organizations.length > 0;
    },
    isPartialySelected() {
      return (this.organizations.some((o) => this.isOrganizationSelected(o.organizationId)) && !this.isAllSelected);
    },
    selectedOrganizations() {
      return this.organizations.filter((o) => this.isOrganizationSelected(o.organizationId));
    },
    notSelectedOrganizations() {
      return this.organizations.filter((o) => !this.isOrganizationSelected(o.organizationId));
    },
    ...mapGetters({
      isOrganizationSelected: 'organizations/isOrganizationSelected',
    }),
    tasks() { return _.filter(BatchTasks, (t) => taskHasContexts(t, 'organization', 'search')); },
    showModal: { get() { return !!this.activeTask; }, set(v) { if (!v) this.activeTask = null; } },
    isQueryEmpty() { return !_.isEmpty(this.baseQuery); },
    totalRecords() { return this.totalRows ? `${this.totalRows} records` : 'No records'; },
  },
  mounted,
  methods: {
    searchOrganizations,
    buildQuery,
    onSelected,
    onSelectedAll,
    resetPager,
    getSelectedContactsResult,
    ...mapActions({
      addToSelection     : 'organizations/addToSelection',
      removeFromSelection: 'organizations/removeFromSelection',
    }),
  },
};

async function getSelectedContactsResult(task) {
  const query = this.baseQuery || {};
  if (!_.isEmpty(query)) {
    const result               = await this.$kronosApi.queryOrganizations({ ...query, limit: 5 });
    this.selectedContactResult = result;
    this.activeTask            = task;
  }
}

function mounted() {
  this.$root.$on('record-deleted', () => {
    if (this.$refs.organizationTable) this.$refs.organizationTable.refresh();
  });
}

//= ================================
//
//= ================================
async function searchOrganizations(ctx) {
  try {
    this.loading       = true;
    this.organizations = [];

    const query = this.buildQuery(ctx);

    if (!query) {
      this.resetPager();
      return [];
    }

    const response = await this.$kronosApi.queryOrganizations(query);

    this.totalRows = response.totalRecordCount;
    const rows     = response.records;

    const thisComponent = this;

    this.organizations =  rows.map((r) => ({
      ...r,
      get selected() {
        return thisComponent.isOrganizationSelected(this.organizationId);
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
function buildQuery(ctx) {
  const query = _(this.baseQuery || {}).omitBy(_.isNil).value();

  // Update score column sortable or not
  this.columns.find((col) => col.key === 'score').sortable = !!query.freeText;

  if (_.isEmpty(query)) { return null; }

  const limit = this.pageSize;
  const skip  = this.pageSize * (this.page - 1);

  if (limit) { query.limit = limit; }
  if (skip) { query.skip = skip; }

  if (ctx.sortBy) { query.sort = sort(ctx); }

  return query;
}

function sort(ctx) {
  const sortFields    = [];
  const sortDirection = ctx.sortDesc ? -1 : 1;
  let   sortField     = ctx.sortBy;

  if (sortField === 'government')         sortField = 'governmentName';
  if (sortField === 'country')            sortField = 'countryName';
  if (sortField === 'organizationTypeId') sortField = 'typeName';

  sortFields.push({ field: sortField, direction: sortDirection });

  return sortFields;
}

function onSelected(item) {
  const organization = cleanOrganization(item);

  if (this.isOrganizationSelected(organization.organizationId)) {
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

//= ================================
// Pager reset to default
//= ================================
function resetPager() {
  this.page      = 1;
  this.totalRows = null;
}

</script>
<style scoped>
.list {
  width: 100%;
}
</style>
