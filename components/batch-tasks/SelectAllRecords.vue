<template>
  <div>
    <CProgress
      height="2rem"
      :value="progressValue"
      color="success"
      class="mb-2"
      striped
      animated
    />
    <span v-if="progressValue">Selecting {{ totalRecordCount }} records... {{ progressValue }}%</span>
    <div class="modal-footer pb-0">
      <button v-if="!stopSelection" class="btn btn-danger" @click="stopSelection = true">
        Stop
      </button>
      <div v-if="stopSelection">
        <button class="btn btn-info" @click="stopSelection = false">
          Resume
        </button>
        <button class="btn btn-secondary" @click="close()">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { CProgress } from '@coreui/vue';
import { mapActions, mapGetters } from 'vuex';
import mixin from '~/components/batch-tasks/mixin';

export default {
  name          : 'SelectAllRecords',
  taskAttributes: {
    caption        : 'Add all to selection',
    title          : 'Selecting search result records',
    icon           : 'checkSquare',
    contexts       : [ 'contact', 'organization', 'search' ],
    hideHeaderClose: true,
  },
  components: { CProgress },
  mixins    : [ mixin ],
  data() {
    return {
      loadedRecordCount: 0,
      stopSelection    : false,
      breakProcessing  : false,
    };
  },
  computed: {
    totalRecordCount() { return this.selectedResult ? this.selectedResult.totalRecordCount : 0; },
    selectionSuccess() { return this.loadedRecordCount === this.selectedResult.totalRecordCount; },
    progressValue() { return this.selectedResult ? Math.round((this.loadedRecordCount / this.selectedResult.totalRecordCount) * 100) : 0; },
    ...mapGetters({
      isContactSelected     : 'contacts/isContactSelected',
      isOrganizationSelected: 'organizations/isOrganizationSelected',
    }),
  },
  mounted,
  methods: {
    close,
    addToSelection,
    ...mapActions({
      addContactToSelection     : 'contacts/addToSelection',
      addOrganizationToSelection: 'organizations/addToSelection',
    }),
  },
};

async function mounted() {
  const cursor           = this.selectedResult.getCursor();
  let record             = null;
  this.loadedRecordCount = 0;
  this.stopSelection     = false;

  while (record = await cursor.next()) { // eslint-disable-line no-cond-assign, no-await-in-loop
    this.addToSelection(record);
    this.loadedRecordCount++;

    if (this.breakProcessing) break;

    while (this.stopSelection) {
      await sleep(1000); // eslint-disable-line no-await-in-loop

      if (this.breakProcessing) break;
    }
  }
  this.close();
}

function addToSelection(record) {
  if (record.contactId)  { if (!this.isContactSelected(record))      this.addContactToSelection(record); }
  if (!record.contactId) { if (!this.isOrganizationSelected(record)) this.addOrganizationToSelection(record); }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function close() {
  this.breakProcessing = true;
  this.stopSelection   = true;
  this.$emit('close');
}

</script>
