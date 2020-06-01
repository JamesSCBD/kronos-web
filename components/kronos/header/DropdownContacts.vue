<template>
  <div>
    <CDropdown
      in-nav
      class="c-header-nav-items"
      placement="bottom-end"
      add-menu-classes="pt-0"
    >
      <template #toggler>
        <CHeaderNavItem class="d-md-down-none mx-2">
          <CHeaderNavLink>
            <CIcon name="addressBook" />
            <CBadge v-if="selectedCount" color="info" class="ml-auto">
              {{ selectedCount }}
            </CBadge>
          </CHeaderNavLink>
        </CHeaderNavItem>
      </template>
      <CDropdownItem :disabled="!selectedCount" @click="exportEmailsModal = true; reRenderExportEmails()">
        <CIcon name="fileExport" class=" pr-1" /> Export Emails
      </CDropdownItem>
      <CDropdownItem :disabled="!selectedCount" @click="deleteModal = true; reRenderMultiDelete()">
        <CIcon name="trashAlt" class="pr-1" /> Delete
        <CBadge v-if="selectedCount" color="info" class="ml-auto">
          {{ selectedCount }}
        </CBadge>
      </CDropdownItem>
      <CDropdownItem :disabled="!selectedCount" @click="clearSelection()">
        <i class="cil-clear-all pr-1" />Clear Selection
        <CBadge v-if="selectedCount" color="info" class="ml-auto">
          {{ selectedCount }}
        </CBadge>
      </CDropdownItem>
    </CDropdown>

    <!-- Modal Component -->
    <CModal
      title="Export Emails"
      :show.sync="exportEmailsModal"
      size="lg"
      class="export-email"
    >
      <ExportEmails :key="emailComponentKey" :selection-list="selectedContacts" />
    </CModal>
    <!-- Modal Component -->

    <MultiDeleteModal :key="multiDeletecomponentKey" :show.sync="deleteModal" :selection-list="selectedContacts" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import {
  CHeaderNavItem, CHeaderNavLink, CDropdown, CDropdownItem, CModal,
} from '@coreui/vue';
import ExportEmails from '~/components/ExportEmails';
import  MultiDeleteModal  from '~/components/MultiDeleteModal';

export default {
  name      : 'DropdownContacts',
  components: {
    CHeaderNavItem, CHeaderNavLink, CDropdown, CDropdownItem, CModal, ExportEmails, MultiDeleteModal,
  },
  data() {
    return {
      exportEmailsModal      : false,
      deleteModal            : false,
      emailComponentKey      : 0,
      multiDeletecomponentKey: 0,
    };
  },
  computed: {
    ...mapGetters({
      selectedCount   : 'contacts/selectedCount',
      selectedContacts: 'contacts/selectedContacts',
    }),
  },
  methods: {
    ...mapActions({
      clearSelection: 'contacts/clearSelection',
    }),
    reRenderExportEmails() {
      this.emailComponentKey += 1;
    },
    reRenderMultiDelete() {
      this.multiDeletecomponentKey += 1;
    },
  },
};

</script>
