<template>
  <div>
    <CModal
      :title="title"
      :show="showModal && step==='preview'"
      size="lg"
      class="batch-deletion"
      @update:show="close()"
    >
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
      <template #footer>
        <span class="w-100 text-center"><i class="cil-warning pr-1" />All record will be deleted</span>
        <CButton color="danger" @click="step='warning'">
          Yes Delete
        </CButton>
        <CButton color="secondary" @click="close()">
          Cancel
        </CButton>
      </template>
    </CModal>
    <CModal
      :title="title"
      :show="showModal && step==='warning'"
      class="batch-deletion"
      @update:show="close()"
    >
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
      <template #footer>
        <span class="w-100 text-center"><i class="cil-warning pr-1" />WARNING: operation cannot be cancelled.</span>
        <CButton color="danger" @click="onDelete()">
          Yes Delete
        </CButton>
        <CButton color="secondary" @click="close()">
          Cancel
        </CButton>
      </template>
    </CModal>
    <CModal
      :title="title"
      :show="showModal && step === 'progress'"
      @update:show="close()"
    >
      <strong>Deletion {{ deleteRecordCount }}/{{ recordCount }}</strong>
      <CProgress
        key="bar.color"
        height="2rem"
        :value="progressValue"
        color="success"
        show-percentage
        class="mb-2"
        :striped="true"
      />
      <CAlert
        :show.sync="errorMsgDismissTtl"
        close-button
        color="warning"
        fade
      >
        <strong>Internal server error: Please try again later</strong>
      </CAlert>
      <template #footer>
        <CButton v-if="!deleteSuccess && !stopDeletion" color="danger" @click="stopDeletion = true">
          Stop
        </CButton>
        <CButton v-if="deleteSuccess || stopDeletion" color="success" @click="close()">
          Ok
        </CButton>
      </template>
    </CModal>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import {
  CModal, CButton, CAlert, CProgress,
} from '@coreui/vue';
import { BTable, BPagination, BFormInput } from 'bootstrap-vue';

export default {
  name      : 'MultiDeleteModal',
  components: {
    CModal, BTable, BPagination, CButton, BFormInput, CAlert, CProgress,
  },
  props: {
    show: {
      type    : Boolean,
      required: false,
      default : false,
    },
    selectionList: { type: Array, default: () => ([]) },
  },
  data() {
    return {
      step                   : 'preview',
      columns                : [{ key: 'name' }, { key: 'organization' }, { key: 'emailOrCountry' }],
      page                   : 1,
      perPage                : 5,
      recordCount            : this.selectionList.length,
      deleteRecordCount      : 0,
      confirmationRecordCount: '',
      errorMsgDismissTtl     : 0,
      stopDeletion           : false,
    };
  },
  computed: {
    showModal: { get() { return this.show; }, set(value) { this.$emit('update:show', value); } },
    title()         { return `Deletion of ${this.recordCount} records`; },
    deleteSuccess() { return this.deleteRecordCount === this.recordCount; },
    progressValue() { return  Math.round((this.deleteRecordCount / this.recordCount) * 100); },
    items()         {
      return this.selectionList.map((s) => ({
        name          : getName(s).trim(),
        organization  : getOrganization.call(this, s).trim(),
        emailOrCountry: getEmailOrCountry.call(this, s).trim(),
      }), this);
    },
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
    ...mapActions({
      clearContactsSelection     : 'contacts/clearSelection',
      clearOrganizationsSelection: 'organizations/clearSelection',
    }),
  },
};

function close() {
  this.step      = 'preview';
  this.showModal = false;
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

  return `${this.getCountryNameByCode(entry.government || entry.country)}`;
}

async function onDelete() {
  try {
    if (this.recordCount !== this.confirmationRecordCount) {
      this.errorMsgDismissTtl = 3;
      return;
    }

    this.step              = 'progress';
    this.deleteRecordCount = 0;

    if ('contactId' in this.selectionList[0]) {
      await this.deleteContact();
    } else {
      await this.deleteOrganization();
    }
  } catch (error) {
    this.errorMsgDismissTtl = 3;
  }
}

async function deleteContact() {
  for (let index = 0; index < this.selectionList.length; index++) {
    if (this.stopDeletion) break;

    // eslint-disable-next-line no-await-in-loop
    await this.$kronosApi.deleteContact(this.selectionList[index].contactId);
    this.deleteRecordCount++;
  }

  if (this.deleteSuccess) {
    this.$root.$emit('record-deleted');
    this.clearContactsSelection();
  }
}

async function deleteOrganization() {
  for (let index = 0; index < this.selectionList.length; index++) {
    if (this.stopDeletion) break;

    // eslint-disable-next-line no-await-in-loop
    await this.$kronosApi.deleteOrganization(this.selectionList[index].organizationId);
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
