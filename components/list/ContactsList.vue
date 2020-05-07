<template>
  <div>
    <pager
      :page.sync="page"
      :page-size.sync="pageSize"
      :record-count="totalRows"
      :sync-query-string="true"
    />
    <BTable
      id="KContactsList"
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
      <template v-slot:head(Title)>
        <span class="text-center">
          <CIcon name="idBadge" />
        </span>
      </template>

      <template v-slot:cell(Country)="{value}">
        <CountryCol v-if="value" :code="value" />
      </template>

      <template v-slot:cell(OrganizationGovernment)="{value}">
        <CountryCol v-if="value" :code="value" />
      </template>

      <template v-slot:cell(Emails)="{value}">
        <EmailCol v-if="value" :emails="value" />
      </template>
      <template v-for="(column, index) in RegStatusColumns" v-slot:[`cell(${column.key})`]="data">
        <RegistrationStatusCol v-if="data.item.StatusEvents" :key="column.key" :registration-status="data.item.StatusEvents[index] || {}" />
      </template>
    </BTable>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters, mapActions } from 'vuex';
import { CountryCol, EmailCol, RegistrationStatusCol } from './columns';
import mixin from './mixin';
import pager from '~/components/controls/Pager';

const baseColumns = [
  { key: 'Selected', label: '', sortable: false },
  { key: 'Title', label: '', sortable: false },
  { key: 'FirstName', label: 'First Name', sortable: true },
  { key: 'LastName', label: 'Last Name', sortable: true },
  { key: 'OrganizationGovernment', label: 'Government', sortable: true },
  { key: 'OrganizationName', label: 'Organization', sortable: true },
  { key: 'Emails', label: 'Email', sortable: true },
  {
    key: 'Country', label: 'Country', sortable: true, class: 'text-left',
  },
  { key: 'Score', label: 'Rank', sortable: true },
];

export default {
  name      : 'ContactsList',
  components: {
    CountryCol, EmailCol, pager, RegistrationStatusCol,
  },
  mixins: [ mixin ],
  props : {
    baseQuery: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      loading  : false,
      columns  : [ ...baseColumns ],
      totalRows: 0,
      page     : 1,
      pageSize : 25,
      contacts : [],
    };
  },
  computed: {
    ...mapGetters({
      getEventCodeById : 'conferences/getEventCodeById',
      isContactSelected: 'contacts/isContactSelected',
    }),
    isAllSelected() {
      return this.contacts.every((c) => this.isContactSelected(c.ContactUID)) && this.contacts.length > 0;
    },
    isPartialySelected() {
      return (this.contacts.some((c) => this.isContactSelected(c.ContactUID)) && !this.isAllSelected);
    },
    selectedContacts() {
      return this.contacts.filter((c) => this.isContactSelected(c.ContactUID));
    },
    notSelectedContacts() {
      return this.contacts.filter((c) => !this.isContactSelected(c.ContactUID));
    },
    RegStatusColumns() {
      return this.columns.filter((column) => column.ColumnType === 'RegStatusColumn');
    },
  },
  methods: {
    searchContacts,
    updateColumns,
    buildQuery,
    onSelected,
    onSelectedAll,
    resetPager,
    ...mapActions({
      addToSelection     : 'contacts/addToSelection',
      removeFromSelection: 'contacts/removeFromSelection',
    }),
  },
};

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

//= ================================
//
//= ================================
async function searchContacts() {
  try {
    this.loading  = true;
    this.contacts = [];

    this.updateColumns();

    const query = this.buildQuery();

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
      get Selected() {
        return thisComponent.isContactSelected(this.ContactUID);
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
  const query     = this.baseQuery || {};
  const eventUIDs = query.StatusForEventUIDs || [];

  const statusColumns = eventUIDs.map((eid, index) => (
    {
      key       : `StatusEvents[${index}].EventUID`,
      label     : this.getEventCodeById(eid),
      sortable  : true,
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

  if (this.isContactSelected(contact.ContactUID)) {
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
  this.totalRows = 0;
}

</script>
<style scoped>
.list {
  width: 100%;
}
</style>
