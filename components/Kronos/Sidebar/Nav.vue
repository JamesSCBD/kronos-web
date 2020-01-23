<template>
  <CSidebarNav>
    <CSidebarNavItem name="Dashbord" icon="tachometerAlt" :to="`/${conferenceCode}/dashboard`" />

    <CSidebarNavTitle> Reg </CSidebarNavTitle>
    
    <CSidebarNavItem name="Contacts" icon="addressBook" :to="`/${conferenceCode}/contacts`" />
    <CSidebarNavItem name="Organizations" icon="building" :to="`/${conferenceCode}/organizations`" />
    <CSidebarNavItem name="Conferences" icon="users" :to="`/conferences`" />
  </CSidebarNav>
</template>

<script>
import { CSidebarNav, CSidebarNavTitle, CSidebarNavItem } from '@coreui/vue'
import { gettersMap } from '@components/Kronos/Sidebar/store-maps'

export default {
  name      : 'KSidebarNav',
  components: { CSidebarNav, CSidebarNavTitle, CSidebarNavItem },
  computed  : { ...gettersMap(), conferenceCode }
}

function conferenceCode (){
  const { conferenceCode } = this.$route.params || {}
  
  return conferenceCode || this.selectedCode
}
</script>

<style scoped>
.indent{ padding-left: 1em; }
</style>
