<template>
  <CSidebarNav>
    <BFormSelect id="page-size" v-model="conferenceId" class="form-control" :options="conferenceOptions" @change="setSelectedConference" />
    <CSidebarNavItem name="Dashbord" icon="tachometerAlt" :to="`/dashboard`" />
    <CSidebarNavTitle> Reg </CSidebarNavTitle>
    <CSidebarNavItem name="Contacts" icon="addressBook" :to="`/contacts`" />
    <CSidebarNavItem name="Organizations" icon="building" :to="`/organizations`" />
    <CSidebarNavItem name="Conferences" icon="users" :to="`/conferences`" />
  </CSidebarNav>
</template>

<script>
import { CSidebarNav, CSidebarNavTitle, CSidebarNavItem } from '@coreui/vue'
import { BFormSelect } from 'bootstrap-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  name      : 'KSidebarNav',
  components: { CSidebarNav, CSidebarNavTitle, CSidebarNavItem, BFormSelect },
  computed  : {
    conferenceOptions,
    ...mapGetters({
      conferenceList: 'conferences/list',
      conferenceId  : 'conferences/selectedId'
    })
  },
  methods: {
    ...mapActions({
      setSelectedConference: 'conferences/setSelected'
    })
  }
}

function conferenceOptions (){
  return this.conferenceList.map(c => ({ value: c._id, text: c.Title.en }))
}

</script>

<style scoped>
.indent{ padding-left: 1em; }
</style>
