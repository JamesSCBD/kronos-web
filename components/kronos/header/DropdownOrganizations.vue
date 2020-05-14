<template>
  <CDropdown
    in-nav
    class="c-header-nav-items"
    placement="bottom-end"
    add-menu-classes="pt-0"
  >
    <template #toggler>
      <CHeaderNavItem class="d-md-down-none mx-4">
        <CHeaderNavLink>
          <CIcon name="building" />
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
    <CDropdownItem :disabled="!selectedQueryCount" @click="clearSelectionQuery()">
      <i class="cil-clear-all pr-1" />Clear Query
      <CBadge v-if="selectedQueryCount" color="info" class="ml-auto">
        {{ selectedQueryCount }}
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
  name      : 'DropdownOrganizations',
  components: {
    CHeaderNavItem, CHeaderNavLink, CDropdown, CDropdownItem,
  },
  computed: {
    showSelectionCount() {
      if (this.selectedCount && this.selectedQueryCount) {
        return `${this.selectedCount} / ${this.selectedQueryCount}`;
      }

      if (this.selectedCount) { return `${this.selectedCount}`; }

      if (this.selectedQueryCount) { return `${this.selectedQueryCount}`; }

      return null;
    },
    ...mapGetters({
      selectedCount     : 'organizations/selectedCount',
      selectedQueryCount: 'organizations/selectedQueryCount',
    }),
  },
  methods: {
    ...mapActions({
      clearSelection     : 'organizations/clearSelection',
      clearSelectionQuery: 'organizations/clearSelectionQuery',
    }),
  },
};
</script>
