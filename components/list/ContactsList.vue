<template>
  <div>
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
    </div>
    <BTable
      id="KContactsList"
      ref="conatactTable"
      :items="searchContacts"
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
      :data-show-multi-sort="true"
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
      <template v-slot:head(title)>
        <span class="text-center">
          <CIcon name="idBadge" />
        </span>
      </template>

      <template v-slot:cell(organization.government)="{value}">
        <CountryCol v-if="value" :code="value" />
      </template>

      <template v-slot:cell(country)="{value}">
        <CountryCol v-if="value" :code="value" />
      </template>

      <template v-slot:cell(emails)="{value}">
        <EmailCol v-if="value" :emails="value" />
      </template>
      <template v-for="(column, index) in RegStatusColumns" v-slot:[`cell(${column.key})`]="data">
        <RegistrationStatusCol v-if="data.item.registrationStatuses" :key="column.key" :registration-status="data.item.registrationStatuses[index] || {}" />
      </template>
    </BTable>
    <!-- Modal Component -->
    <CModal
      v-if="activeTask"
      :title="activeTask.taskAttributes.title || activeTask.taskAttributes.caption"
      :show.sync="showModal"
      :close-on-backdrop="false"
      :size="activeTask.taskAttributes.size || ''"
    >
      <component :is="activeTask.name" :selected-result="selectedContactResult" @close="showModal = false" />
      <template #header-wrapper>
        <div class="modal-header">
          <h5 class="modal-title">
            {{ activeTask.taskAttributes.title || activeTask.taskAttributes.caption }}
          </h5>
          <CButtonClose v-if="!activeTask.taskAttributes.hideHeaderClose" @click="showModal = false" />
        </div>
      </template>
      <template #footer-wrapper>
        <div />
      </template>
    </CModal>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters, mapActions } from 'vuex';
import {
  CModal, CDropdown, CDropdownItem, CButtonClose,
} from '@coreui/vue';
import { CountryCol, EmailCol, RegistrationStatusCol } from './columns';
import mixin from './mixin';
import pager from '~/components/controls/Pager';
import BatchTasks, { taskHasContexts }  from '~/components/batch-tasks';

const baseColumns = [
  { key: 'selected', label: '', sortable: false },
  { key: 'title', label: '', sortable: false },
  { key: 'firstName', label: 'First Name', sortable: true },
  { key: 'lastName', label: 'Last Name', sortable: true },
  { key: 'organization.government', label: 'Government', sortable: true },
  { key: 'organization.name', label: 'Organization', sortable: true },
  { key: 'emails', label: 'Email', sortable: true },
  {
    key: 'country', label: 'Country', sortable: false, class: 'text-left',
  },
  { key: 'score', label: 'Rank', sortable: false },
];

export default {
  name      : 'ContactsList',
  components: {
    CountryCol, EmailCol, pager, RegistrationStatusCol, CModal, ...BatchTasks, CDropdown, CDropdownItem, CButtonClose,
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
      contacts             : [],
      sortBy               : 'firstName',
      sortDesc             : false,
      activeTask           : null,
      selectedContactResult: {},
    };
  },
  computed: {
    ...mapGetters({
      getEventCodeById : 'conferences/getEventCodeById',
      isContactSelected: 'contacts/isContactSelected',
    }),
    isAllSelected() {
      return this.contacts.every((c) => this.isContactSelected(c.contactId)) && this.contacts.length > 0;
    },
    isPartialySelected() {
      return (this.contacts.some((c) => this.isContactSelected(c.contactId)) && !this.isAllSelected);
    },
    selectedContacts() {
      return this.contacts.filter((c) => this.isContactSelected(c.contactId));
    },
    notSelectedContacts() {
      return this.contacts.filter((c) => !this.isContactSelected(c.contactId));
    },
    RegStatusColumns() {
      return this.columns.filter((column) => column.ColumnType === 'RegStatusColumn');
    },
    tasks() { return _.filter(BatchTasks, (t) => taskHasContexts(t, 'contact', 'search')); },
    showModal: { get() { return !!this.activeTask; }, set(v) { if (!v) this.activeTask = null; } },
    isQueryEmpty() { return !_.isEmpty(this.baseQuery); },
    totalRecords() { return this.totalRows ? `${this.totalRows} records` : 'No records'; },
  },
  mounted,
  methods: {
    searchContacts,
    updateColumns,
    buildQuery,
    onSelected,
    onSelectedAll,
    resetPager,
    getSelectedContactsResult,
    ...mapActions({
      addToSelection     : 'contacts/addToSelection',
      removeFromSelection: 'contacts/removeFromSelection',
    }),
  },
};

async function getSelectedContactsResult(task) {
  const query = this.baseQuery || {};
  if (!_.isEmpty(query)) {
    const result               = await this.$kronosApi.queryContacts({ ...query, limit: 5 });
    this.selectedContactResult = result;
    this.activeTask            = task;
  }
}

function mounted() {
  this.$root.$on('record-deleted', () => {
    if (this.$refs.conatactTable) this.$refs.conatactTable.refresh();
  });
}

//= ================================
//
//= ================================
function buildQuery(ctx) {
  const query = _(this.baseQuery || {}).omitBy(_.isNil).value();

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

  if (sortField === 'organization.government') sortField = 'organization.governmentName';
  if (sortField === 'country')                 sortField = 'country';

  sortFields.push({ field: sortField, direction: sortDirection });

  if (sortField === 'firstName') sortFields.push({ field: 'lastName',  direction: sortDirection });
  if (sortField === 'lastName')  sortFields.push({ field: 'firstName', direction: sortDirection });

  return sortFields;
}

//= ================================
//
//= ================================
async function searchContacts(ctx) {
  try {
    this.loading  = true;
    this.contacts = [];

    this.updateColumns();

    const query = this.buildQuery(ctx);

    if (!query) {
      this.resetPager();
      return [];
    }

    const response = await this.$kronosApi.queryContacts(query);

    this.totalRows = response.totalRecordCount;
    const rows     = response.records;

    const thisComponent = this;

    this.contacts = rows.map((r) => ({
      ...r,
      get selected() {
        return thisComponent.isContactSelected(this.contactId);
      },
    }));
    return this.contacts;
  } finally {
    this.loading = false;
  }
}

//= ================================
//
//= ================================
function updateColumns() {
  const query    = this.baseQuery || {};
  const eventIds = query.registrationStatusForEventIds || [];

  // Update score column sortable or not
  this.columns.find((col) => col.key === 'score').sortable = !!query.freeText;

  const statusColumns = eventIds.map((eid, index) => (
    {
      key       : `StatusEvents[${index}].eventId`,
      label     : this.getEventCodeById(eid),
      sortable  : false,
      ColumnType: 'RegStatusColumn',
    }
  ));

  this.columns = [ ...baseColumns, ...statusColumns ];
}

//= ================================
// Call on when user click on contact checkbox
//= ================================
function onSelected(item) {
  const contact = cleanContact(item);

  if (this.isContactSelected(contact.contactId)) {
    this.removeFromSelection(contact);
  } else {
    this.addToSelection(contact);
  }
}

//= ================================
// Call on when user click on select all checkbox
//= ================================
function onSelectedAll() {
  if (this.isAllSelected) {
    this.selectedContacts.forEach((c) => this.removeFromSelection(cleanContact(c)));
  } else {
    this.notSelectedContacts.forEach((c) => this.addToSelection(cleanContact(c)));
  }
}

function cleanContact(item) {
  const { Selected, ...contact } = item;

  return contact;
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
