<template>
  <CHeader fixed with-subheader light>
    <CToggler
      in-header
      class="ml-3 d-lg-none"
      @click="toggleShow()"
    />
    <!-- <CToggler
      in-header
      class="ml-3 d-md-down-none"
      @click="toggleShow()"
    /> -->
    <CHeaderBrand

      class="mx-auto d-lg-none"
      src="/k-logo-full-alt.svg"
      width="190"
      height="46"
      alt="Kronos Logo"
    />
    <CHeaderNav class="d-md-down-none mr-auto">
      <CHeaderNavItem>
        <BreadCrumbs />
      </CHeaderNavItem>
    </CHeaderNav>

    <CHeaderNav class="mr-4">
      <CHeaderNavItem class="d-md-down-none mx-2">
        <CHeaderNavLink>
          <!-- some icon messgeses maybe -->
        </CHeaderNavLink>
      </CHeaderNavItem>

      <DropdownAccnt />
    </CHeaderNav>
    <SubHeader class="px-3 d-lg-none" />
  </CHeader>
</template>

<script>
import { CHeader, CHeaderBrand, CHeaderNav, CHeaderNavItem, CHeaderNavLink, CToggler } from '@coreui/vue'
import { mutationsMap  } from '@components/Kronos/Sidebar/store-maps'
import BreadCrumbs       from './BreadCrumbs'
import DropdownAccnt     from './DropdownAccnt'
import SubHeader         from './SubHeader'

export default {
  name      : 'KHeader',
  components: { BreadCrumbs, SubHeader, DropdownAccnt, CHeader, CHeaderBrand, CHeaderNav, CHeaderNavItem, CHeaderNavLink, CToggler },
  methods   : { ...mutationsMap() }
}

</script>
