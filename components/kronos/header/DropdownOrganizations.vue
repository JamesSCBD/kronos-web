<template>
  <div>
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
            <CBadge v-if="selectedCount" color="info" class="ml-auto">
              {{ selectedCount }}
            </CBadge>
          </CHeaderNavLink>
        </CHeaderNavItem>
      </template>
      <CDropdownItem v-for="task in tasks" :key="task.name" :disabled="!selectedCount" @click="activeTask=task">
        <CIcon :name="task.taskAttributes.icon" class="pr-1" /> {{ task.taskAttributes.caption }}
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
      v-if="activeTask"
      :title="activeTask.taskAttributes.title || activeTask.taskAttributes.caption"
      :show.sync="showModal"
      :close-on-backdrop="false"
      size="lg"
    >
      <component :is="activeTask.name" :selected-result="selectedOrganizationsResult" @close="showModal = false" />
      <template #footer-wrapper>
        <div />
      </template>
    </CModal>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters, mapActions } from 'vuex';
import {
  CHeaderNavItem, CHeaderNavLink, CDropdown, CDropdownItem, CModal,
} from '@coreui/vue';
import BatchTasks, { taskHasContexts }  from '~/components/batch-tasks';

export default {
  name      : 'DropdownOrganizations',
  components: {
    CHeaderNavItem, CHeaderNavLink, CDropdown, CDropdownItem, CModal, ...BatchTasks,
  },
  data() {
    return {
      activeTask: null,
    };
  },
  computed: {
    tasks() { return _.filter(BatchTasks, (t) => taskHasContexts(t, 'organization', 'selection')); },
    showModal: { get() { return !!this.activeTask; }, set(v) { if (!v) this.activeTask = null; } },
    ...mapGetters({
      selectedCount              : 'organizations/selectedCount',
      selectedOrganizationsResult: 'organizations/selectedOrganizationsResult',
    }),
  },
  methods: {
    ...mapActions({
      clearSelection: 'organizations/clearSelection',
    }),
  },
};
</script>
