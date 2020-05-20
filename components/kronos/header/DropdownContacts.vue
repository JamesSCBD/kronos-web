<template>
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
          <CBadge v-if="showSelectionCount" color="info" class="ml-auto">
            {{ showSelectionCount }}
          </CBadge>
        </CHeaderNavLink>
      </CHeaderNavItem>
    </template>
    <CDropdownItem :disabled="!selectedCount" @click="clearSelection()">
      <i class="cil-clear-all pr-1" />Clear Selection
      <CBadge v-if="selectedCount" color="info" class="ml-auto">
        {{ selectedCount }}
      </CBadge>
    </CDropdownItem>
  </CDropdown>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import {
  CHeaderNavItem, CHeaderNavLink, CDropdown, CDropdownItem,
} from '@coreui/vue';

export default {
  name      : 'DropdownContacts',
  components: {
    CHeaderNavItem, CHeaderNavLink, CDropdown, CDropdownItem,
  },
  computed: {
    showSelectionCount() {
      if (this.selectedCount) { return `${this.selectedCount}`; }

      return null;
    },
    ...mapGetters({
      selectedCount: 'contacts/selectedCount',
    }),
  },
  methods: {
    ...mapActions({
      clearSelection: 'contacts/clearSelection',
    }),
  },
};
</script>
