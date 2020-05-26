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
      <CDropdownItem :disabled="!selectedCount" @click="exportEmailsModel = true; reRenderExportEmails()">
        <CIcon name="fileExport" class=" pr-1" /> Export Emails
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
      :show.sync="exportEmailsModel"
      size="lg"
      class="export-email"
    >
      <ExportEmails :key="componentKey" :selection-list="selectedContacts" />
    </CModal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import {
  CHeaderNavItem, CHeaderNavLink, CDropdown, CDropdownItem, CModal,
} from '@coreui/vue';
import ExportEmails from '~/components/ExportEmails';

export default {
  name      : 'DropdownContacts',
  components: {
    CHeaderNavItem, CHeaderNavLink, CDropdown, CDropdownItem, CModal, ExportEmails,
  },
  data() {
    return {
      exportEmailsModel: false,
      componentKey     : 0,
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
      this.componentKey += 1;
    },
  },
};

</script>
