<template>
  <div class="export-task">
    <BTable
      id="exportList"
      :items="previewItems"
      :fields="columns"
      class="mb-0 list w-100"
      responsive="md"
      striped
      small
      bordered
    >
      <template v-slot:table-busy>
        <div class="text-center text-danger my-2">
          <CIcon name="circleNotch" class="fa-spin fa-3x fa-fw" />
          <strong>Loading...</strong>
        </div>
      </template>
      <template v-slot:cell(emails)="{value}">
        <EmailCol v-if="value" :emails="value" />
      </template>
    </BTable>
    <div class="modal-footer pb-0">
      <button class="btn btn-info" @click="exportRecords()">
        Download
      </button>
      <button class="btn btn-secondary" @click="close()">
        Close
      </button>
    </div>
    <!-- Modal Component -->
    <CModal
      title="Processing..."
      :show.sync="progressModal"
      :close-on-backdrop="false"
    >
      <CProgress
        height="2rem"
        :value="progressValue"
        color="success"
        class="mb-2"
        striped
        animated
      />
      <span v-if="progressValue< 100">Downloading {{ totalRecordCount }} records... {{ progressValue }}%</span>
      <span v-if="progressValue>=100">Exporting... <CIcon name="circleNotch" class="fa-spin fa-3x fa-fw" /></span>
      <template #footer-wrapper>
        <div />
      </template>
    </CModal>
  </div>
</template>

<script>
import { BTable } from 'bootstrap-vue';
import _ from 'lodash';
import { CModal, CProgress } from '@coreui/vue';
import { utils, write } from 'xlsx';
import { saveAs } from 'file-saver';
import { DateTime } from 'luxon';
import mixin from '~/components/batch-tasks/mixin';
import { EmailCol } from '~/components/list/columns';

const isPlainObject = (x) =>  Object(x) === x && !Array.isArray(x);

export default {
  name          : 'ExportToExcel',
  taskAttributes: {
    caption : 'Export to Excel',
    title   : 'Export records to Excel',
    icon    : 'table',
    contexts: [ 'contact', 'organization', 'selection', 'search' ],
    size    : 'xl',
  },
  components: {
    BTable, EmailCol, CModal, CProgress,
  },
  mixins: [ mixin ],
  data() {
    return {
      columns          : [],
      progressModal    : false,
      loadedRecordCount: 0,
    };
  },
  computed: {
    totalRecordCount() { return this.selectedResult ? this.selectedResult.totalRecordCount : 0; },
    progressValue() { return this.selectedResult ? Math.round((this.loadedRecordCount / this.selectedResult.totalRecordCount) * 100) : 0; },
  },
  methods: {
    close,
    previewItems,
    exportRecords,
  },
};

async function previewItems() {
  const cursor  = this.selectedResult.getCursor();
  const records = [];
  let record    = null;

  while (record = await cursor.next()) { // eslint-disable-line no-cond-assign, no-await-in-loop
    records.push(record);

    if (records.length >= 5) break; // load max 5 records for preview;
  }

  this.columns = [];

  if (records[0]) {
    this.columns = _(getRecordKeys(records[0]))
      .sortBy(fieldSortKey)
      .without('contactId', 'organizationId') // remove id for preview
      .map((field) => ({ key: field }))
      .value();
  }

  return records;
}

function getRecordKeys(obj) {
  let keys = [];
  for (const key in obj) { // eslint-disable-line
    const data = obj[key];
    if (isPlainObject(data)) {
      const subkeys = getRecordKeys(data);
      keys          = keys.concat(subkeys.map((subkey) => `${key}.${subkey}`));
    } else if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        if (typeof (data[i]) === 'string') {
          keys.push(`${key}[${i}]`);
        } else {
          const subkeys = getRecordKeys(data[i]);
          keys          = keys.concat(subkeys.map((subkey) => `${key}[${i}].${subkey}`));
        }
      }
    } else {
      keys.push(key);
    }
  }
  return keys;
}

function close() {
  this.progressModal = false;
  this.$emit('close');
}

async function exportRecords() {
  this.progressModal     = true;
  this.loadedRecordCount = 0;

  const now     = DateTime.fromJSDate(new Date());
  const cursor  = this.selectedResult.getCursor();
  const records = [];
  let   record  = null;
  let   fields  = [];

  while (record = await cursor.next()) { // eslint-disable-line no-cond-assign, no-await-in-loop
    records.push(record);

    fields                 = _.union(fields, getRecordKeys(record));
    this.loadedRecordCount = records.length;

    if (!this.progressModal) return;
  }

  fields = _.sortBy(fields, fieldSortKey);

  const name      = fields.includes('contactId') ? 'contacts' : 'organizations';
  const table     = exportToTable(records, fields);
  const workSheet = utils.table_to_sheet(table);
  const workBook  = {
    SheetNames: [ name ],
    Sheets    : { [name]: workSheet },
  };

  const xlsxData = write(workBook, { bookType: 'xlsx', bookSST: true, type: 'binary' });
  const filename = `${name}-${now.toFormat('yyyy-MM-dd')}T${now.toFormat('HH-mm-ss')}.xlsx`;

  saveAs(new Blob([ convertToArrayBuffer(xlsxData) ], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), filename);

  this.close();
}

function convertToArrayBuffer(s) {
  const buf  = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i !== s.length; ++i) {
    view[i] = s.charCodeAt(i) & 0xFF; // eslint-disable-line no-bitwise
  }
  return buf;
}

function exportToTable(records, fields) {
  const table  = createElementTo(null,  'table'); table.setAttribute('id', 'generateTable');
  const header = createElementTo(table, 'thead', 'tr');
  const body   = createElementTo(table, 'tbody');

  fields.forEach((field) => {
    createElementTo(header, 'th').appendChild(document.createTextNode(field));
  });

  records.forEach((record) => {
    const row = createElementTo(body, 'tr');

    fields.forEach((field) => { // eslint-disable-line no-loop-func
      createElementTo(row, 'td').appendChild(document.createTextNode(_.get(record, field, '')));
    });
  });

  return table;
}

function createElementTo(to, ...tags) {
  let node   = null;
  let parent = to;

  tags.forEach((tag) => {
    node = document.createElement(tag);

    if (parent) parent.appendChild(node);

    parent = node;
  });

  return node;
}

const FIELDS_PRIORITIES = [
  'contactId',
  'organizationId',
  'title',
  'firstName',
  'lastName',
  'name',
  'acronym',
  'organization',
  'address',
  'city',
  'state',
  'country',
  'postalCode',
];

function fieldSortKey(field) {
  let priority = -1;

  if (priority < 0) priority = _.findIndex(FIELDS_PRIORITIES, (o) => o === field);
  if (priority < 0) priority = _.findIndex(FIELDS_PRIORITIES, (o) => field.startsWith(o));
  if (priority < 0) priority = 10000;

  let sortKey = `${priority}_${field.toLowerCase()}`;

  sortKey = sortKey.replace(/\d+/g, (m) =>  '0000000000'.substr(m.length - 1) + m); // pad numbers with leading 0 for sorting

  return sortKey;
}

</script>

<style scoped>
.export-task >>> table#exportList > tbody > tr > td {
  overflow: hidden;
  white-space: pre;
  max-width: 175px;
}
</style>
