<template>
  <CSidebarNav>
    <BFormSelect id="page-size" :value="conferenceId" class="form-control" :options="conferenceOptions" @change="setSelectedConference" />
    <CSidebarNavItem name="Dashbord" icon="tachometerAlt" :to="`/`" />
    <CSidebarNavTitle> Reg </CSidebarNavTitle>
    <CSidebarNavItem name="Contacts" icon="addressBook" :to="`/contacts`" />
    <CSidebarNavItem name="Organizations" icon="building" :to="`/organizations`" />
    <CSidebarNavItem name="Conferences" icon="users" :to="`/conferences`" />
    <CSidebarNavItem name="Reports" icon="file" :to="`/reports`" />
  </CSidebarNav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import {
  CSidebarNav, CSidebarNavTitle, CSidebarNavItem,
} from '@coreui/vue';
import { BFormSelect } from 'bootstrap-vue';

export default {
  name      : 'KSidebarNav',
  components: {
    CSidebarNav, CSidebarNavTitle, CSidebarNavItem, BFormSelect,
  },
  computed: {
    conferenceOptions,
    ...mapGetters({
      conferenceList: 'conferences/list',
      conferenceId  : 'conferences/selectedId',
    }),
  },
  methods: {
    ...mapActions({
      setSelectedConference: 'conferences/setSelected',
    }),
  },
};

function conferenceOptions() {
  return this.conferenceList.map((c) => ({ value: c._id, text: c.Title.en }));
}

</script>

<style scoped>
.indent{ padding-left: 1em; }
</style>
