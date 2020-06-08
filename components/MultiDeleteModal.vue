<template>
  <div>
    <div v-if="step==='preview'">
      Preview of the records to be deleted
      <div class="paginationRow w-auto float-right popup-pagi">
        <BPagination
          v-if="recordCount > perPage"
          v-model="page"
          :total-rows="recordCount"
          :per-page="perPage"
          prev-text="Prev"
          next-text="Next"
          hide-goto-end-buttons
          aria-controls="deleteList"
          limit="1"
          size="sm"
        />
      </div>
      <BTable
        id="deleteList"
        :items="items"
        :fields="columns"
        :per-page="perPage"
        :current-page="page"
        class="mb-0 list w-100 mt-3"
        responsive="md"
        head-variant="light"
        thead-class="hidden_header"
        small
        :bordered="false"
      />
      <div class="modal-footer" style="justify-content: center">
        <p class="w-100 text-center">
          <i class="cil-warning pr-1" />All record will be deleted
        </p>
        <CButton color="danger" @click="step='warning'">
          Yes Delete
        </CButton>
        <CButton color="secondary" @click="close()">
          Cancel
        </CButton>
      </div>
    </div>
    <div v-if="step==='warning'">
      <p> Please type the total number of record "{{ recordCount }}" to confirm the operation.</p>

      <p>
        I confirm that
        <BFormInput
          id="confirmInput"
          v-model.number="confirmationRecordCount"
          placeholder="type here"
          class="d-inline-block form-control w-auto"
        />  records will be delete.
      </p>
      <CAlert
        :show.sync="errorMsgDismissTtl"
        close-button
        color="warning"
        fade
      >
        <strong>Please type correct total number of records to delete</strong>
      </CAlert>
      <div class="modal-footer" style="justify-content: center">
        <p class="w-100 text-center">
          <i class="cil-warning pr-1" />WARNING: operation cannot be cancelled.
        </p>
        <CButton color="danger" @click="onDelete()">
          Yes Delete
        </CButton>
        <CButton color="secondary" @click="close()">
          Cancel
        </CButton>
      </div>
    </div>
    <div v-if="step === 'progress'">
      <div v-if="startDeletion">
        <strong>Deletion {{ deleteRecordCount }}/{{ recordCount }}</strong>
        <CProgress
          height="2rem"
          :value="progressValue"
          color="success"
          show-percentage
          class="mb-2"
          :striped="true"
        />
      </div>
      <div v-if="!startDeletion">
        <strong>Preparing for deletion... </strong>
        <CProgress
          height="2rem"
          :value="prepareValue"
          show-percentage
          color="info"
          class="mb-2"
          :striped="true"
        />
      </div>

      <CAlert
        :show.sync="errorMsgDismissTtl"
        close-button
        color="warning"
        fade
      >
        <strong>Internal server error: Please try again later</strong>
      </CAlert>
      <div class="modal-footer" style="justify-content: center">
        <CButton v-if="!deleteSuccess && !stopDeletion" color="danger" @click="stopDeletion = true">
          Stop
        </CButton>
        <CButton v-if="deleteSuccess || stopDeletion" color="success" @click="close()">
          Ok
        </CButton>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import {
  CButton, CAlert, CProgress,
} from '@coreui/vue';
import { BTable, BPagination, BFormInput } from 'bootstrap-vue';
import mixin from '~/components/batch-tasks/mixin';

export default {
  name          : 'MultiDeleteModal',
  taskAttributes: {
    caption : 'Delete',
    icon    : 'trashAlt',
    contexts: [ 'contact', 'organization', 'selection' ],
  },
  components: {
    BTable, BPagination, CButton, BFormInput, CAlert, CProgress,
  },
  mixins: [ mixin ],
  data() {
    return {
      step                   : 'preview',
      columns                : [{ key: 'name' }, { key: 'organization' }, { key: 'emailOrCountry' }],
      page                   : 1,
      perPage                : 5,
      recordCount            : this.selectedResult.totalRecordCount,
      deleteRecordCount      : 0,
      confirmationRecordCount: '',
      errorMsgDismissTtl     : 0,
      stopDeletion           : false,
      startDeletion          : false,
      deletedIds             : [],
    };
  },
  computed: {
    title()         { return `Deletion of ${this.recordCount} records`; },
    deleteSuccess() { return this.deleteRecordCount === this.recordCount; },
    progressValue() { return  Math.round((this.deleteRecordCount / this.recordCount) * 100); },
    prepareValue() { return  Math.round((this.deletedIds.length / this.recordCount) * 100); },
    ...mapGetters({
      getCountryNameByCode   : 'countries/getNameByCode',
      getOrganizationTypeById: 'organizations/getTypeById',
    }),
  },
  methods: {
    close,
    onDelete,
    deleteContact,
    deleteOrganization,
    items,
    ...mapActions({
      clearContactsSelection     : 'contacts/clearSelection',
      clearOrganizationsSelection: 'organizations/clearSelection',
    }),
  },
};

async function items()    {
  const skip    = this.perPage * (this.page - 1);
  const cursor  = this.selectedResult.getCursor({ skip });
  const records = [];
  let obj       = null;

  while (obj = await cursor.next()) { // eslint-disable-line no-cond-assign, no-await-in-loop
    records.push({
      name          : getName(obj).trim(),
      organization  : getOrganization.call(this, obj).trim(),
      emailOrCountry: getEmailOrCountry.call(this, obj).trim(),
    });

    if (records.length >= this.perPage) break; // load max this.perPage records;
  }

  return records;
}

function close() {
  this.step = 'preview';
  this.$emit('close');
}

function getName(entry) {
  if (entry.contactId) return `${entry.firstName} ${entry.lastName}`;

  return `${entry.acronym || entry.name}`;
}

function getOrganization(entry) {
  if (entry.contactId) return `${entry.organization.acronym || entry.organization.name}`;

  const  organizationType = this.getOrganizationTypeById(entry.organizationTypeId);

  return `${organizationType.acronym || organizationType.title}`;
}

function getEmailOrCountry(entry) {
  if (entry.contactId) return `${entry.emails.length ? entry.emails[0] : ''}`;

  const country = entry.government || entry.country;

  return country ? `${this.getCountryNameByCode(entry.government || entry.country)}` : '';
}

async function onDelete() {
  try {
    if (this.recordCount !== this.confirmationRecordCount) {
      this.errorMsgDismissTtl = 3;
      return;
    }

    this.step              = 'progress';
    this.deleteRecordCount = 0;

    const cursor    = this.selectedResult.getCursor();
    let obj         = null;
    this.deletedIds = [];

    while (obj = await cursor.next()) { // eslint-disable-line no-cond-assign, no-await-in-loop
      this.deletedIds.push({
        type: obj.contactId ? 'contacts' : 'organizations',
        id  : obj.contactId || obj.organizationId,
      });
    }

    this.startDeletion = true;
    if (this.deletedIds[0].type === 'contacts') {
      await this.deleteContact();
    } else {
      await this.deleteOrganization();
    }
  } catch (error) {
    this.errorMsgDismissTtl = 3;
  }
}

async function deleteContact() {
  for (let index = 0; index < this.deletedIds.length; index++) {
    if (this.stopDeletion) break;

    // eslint-disable-next-line no-await-in-loop
    await this.$kronosApi.deleteContact(this.deletedIds[index].id);
    this.deleteRecordCount++;
  }

  if (this.deleteSuccess) {
    this.$root.$emit('record-deleted');
    this.clearContactsSelection();
  }
}

async function deleteOrganization() {
  for (let index = 0; index < this.deletedIds.length; index++) {
    if (this.stopDeletion) break;

    // eslint-disable-next-line no-await-in-loop
    await this.$kronosApi.deleteOrganization(this.deletedIds[index].id);
    this.deleteRecordCount++;
  }

  if (this.deleteSuccess) {
    this.$root.$emit('record-deleted');
    this.clearOrganizationsSelection();
  }
}
</script>

<style >
.hidden_header {
  display: none;
}
</style>
