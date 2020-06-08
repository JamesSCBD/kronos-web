<template>
  <div class="container-fluid">
    <div class="card-body filter_Sec">
      <div class="row">
        <div class="col-md-6 col-sm-6 col-xs-12">
          <div class="form-group">
            <div class="input-group mb-3">
              <BFormGroup label="Email Format">
                <BFormRadioGroup
                  v-model="selectedFormat"
                  :options="formatOptions"
                  name="email-format"
                  stacked
                />
              </BFormGroup>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-sm-6 col-xs-12">
          <div class="row">
            <div class="col-7 pr-0">
              <div class="form-group">
                <BFormGroup label="Email to Export">
                  <BFormRadioGroup
                    v-model="selectedExport"
                    :options="exportOptions"
                    name="email-to-export"
                    stacked
                  />
                </BFormGroup>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6 col-sm-6 col-xs-12">
          <div class="form-group">
            <BFormGroup label="Spearator">
              <BFormRadioGroup
                v-model="selectedSpearator"
                :options="spearatorOptions"
                name="spearator"
                stacked
              />
            </BFormGroup>
          </div>
        </div>
        <div class="col-md-6 col-sm-6 col-xs-12">
          <div class="form-group">
            <BFormGroup label="Row Size">
              <BFormSelect
                id="row-size"
                v-model.number="selectedRowSize"
                class="form-control"
                :options="rowSizeOptions"
              />
            </BFormGroup>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12">
          <div class="form-group">
            <button class="btn col-sm-2 btn-primary float-right" @click="onEmailsExport()">
              Export
            </button>
          </div>
        </div>
      </div>
      <div class="line-top" />
      <div v-for="row in textareaEmails" :key="row.emails" class="row">
        <div class="col-md-11 col-sm-11 col-xs-12">
          <div class="form-group">
            <BFormTextarea
              id="textarea"
              :value="row.emails"
              :rows="rows"
              readonly
            />
          </div>
        </div>
        <div class="col-md-1 col-sm-1 col-xs-12">
          <div class="form-group copy-btn">
            <button title="Copy" @click="copy(row.emails)">
              <i class="cil-copy" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  BFormGroup, BFormRadioGroup, BFormSelect, BFormTextarea,
} from 'bootstrap-vue';
import _ from 'lodash';
import copy from 'copy-to-clipboard';
import mixin from '~/components/batch-tasks/mixin';

const rowSizeOptions = [
  { value: 50, text: '50/row (Outlook)' },
  { value: 100, text: '100/rows' },
  { value: 250, text: '250/rows' },
  { value: null, text: 'All' },
];

const formatOptions     = [
  { text: 'Name and Email', value: 'NAME_EMAIL' },
  { text: 'Email address only', value: 'EMAIL' },
];
const baseExportOptions = [
  { text: 'Main address', value: 'MAIN' },
];
const spearatorOptions  = [
  { text: 'Outlook', value: ';' },
  { text: 'One by line ', value: '\n' },
];

export default {
  name          : 'ExportEmails',
  taskAttributes: {
    caption : 'Export emails',
    icon    : 'fileExport',
    contexts: [ 'contact', 'organization', 'selection', 'search' ],
  },
  components: {
    BFormGroup, BFormRadioGroup, BFormSelect, BFormTextarea,
  },
  mixins: [ mixin ],
  data() {
    return {
      selectedFormat   : 'NAME_EMAIL',
      selectedExport   : 'MAIN',
      selectedSpearator: ';',
      selectedRowSize  : 50,
      formatOptions,
      exportOptions    : [ ...baseExportOptions ],
      spearatorOptions,
      rowSizeOptions,
      textareaEmails   : [],
      rows             : 3,
    };
  },
  mounted,
  methods: {
    onEmailsExport,
    copy,
  },
};

async function mounted() {
  const data = await this.selectedResult.getCursor().next();

  if (data) {
    if (data.contactId) {
      this.exportOptions.push({ value: 'MAINCCs', text: 'Main + CCs address' });
    } else {
      this.exportOptions.push({ value: 'MAINCCs', text: 'Main + Focal Point' });
    }
  }
}

async function onEmailsExport() {
  const cursor = this.selectedResult.getCursor();
  let obj      = null;
  let emails   = [];

  while (obj = await cursor.next()) { // eslint-disable-line no-cond-assign, no-await-in-loop
    emails = emails.concat(extractEmails.call(this, obj));
  }

  emails = _(emails.map((e) => formatEmailAddress.call(this, e))).flatten().uniq().value();

  this.textareaEmails = _.chunk(emails, this.selectedRowSize || emails.length)
    .map((rowEmails) => ({ emails: rowEmails.join(this.selectedSpearator) }));

  this.rows = this.selectedRowSize ? 3 : 10;
}

function formatEmailAddress(email) {
  return this.selectedFormat === 'NAME_EMAIL' ? `${email.name || ''}  <${email.address}>`.trim() : `${email.address}`.trim();
}

function extractEmails(entry) {
  const thisComponent = this;

  let emails = [];

  emails = emails.concat(entry.emails.map((address) => ({
    address,
    name: getName.call(thisComponent, entry),
  })));

  if (this.selectedExport === 'MAINCCs') {
    if (entry.contactId) emails = emails.concat(entry.emailCcs.map((address) => ({ address }))); // no name on CC addresses
    if (entry.focalPoint)  emails = emails.concat(extractEmails(entry.focalPoint));
  }

  return _.uniqBy(emails, (o) => o.address);
}

function getName(entry) {
  if (entry.contactId) return `${entry.title} ${entry.firstName} ${entry.lastName}`;

  return `${entry.name}`;
}
</script>
