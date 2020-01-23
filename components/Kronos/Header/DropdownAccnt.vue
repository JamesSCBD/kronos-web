<template>
  <CDropdown in-nav class="c-header-nav-items" placement="bottom-end" add-menu-classes="pt-0">
    <template #toggler>
      <CHeaderNavLink>
        <Avatar :username="$me.name || 'Anon'" />
      </CHeaderNavLink>
    </template>
    <CDropdownHeader tag="div" class="text-center" color="light">
      <strong>Account</strong>
    </CDropdownHeader>
    <CDropdownItem>
      Messages
      <CBadge color="success" class="ml-auto">
        55
      </CBadge>
    </CDropdownItem>
    <CDropdownDivider />
    <CDropdownItem :href="`${$auth.accountsUrl}/profile${returnUrl}`" target="_blank" rel="noopener">
      <CIcon name="user" /> Profile
    </CDropdownItem>
    <CDropdownItem @click="$logOut(); $router.push('/login')">
      <CIcon name="signOutAlt" /> Logout
    </CDropdownItem>
  </CDropdown>
</template>

<script>
import { CDropdown, CDropdownHeader, CDropdownItem, CDropdownDivider, CHeaderNavLink } from '@coreui/vue'
import Avatar from 'vue-avatar'

export default {
  name      : 'DropdownAccnt',
  components: { Avatar, CDropdown, CDropdownHeader, CDropdownItem, CDropdownDivider, CHeaderNavLink },
  computed  : { returnUrl }
}

function returnUrl (){
  if (!this.isServer) return encodeURIComponent('?returnUrl=' + window.location.href)
  return ''
}
</script>

<style scoped>
.c-icon { margin-right: 0.3rem; }
</style>
