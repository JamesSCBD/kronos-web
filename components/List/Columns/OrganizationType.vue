<template>
  <div class="text-left">
    {{ getOrganizationNameById(organizationTypeId) }}
  </div>
</template>

<script>

export default {
  components: {  },
  props     : { organizationTypeId: { type: String, required: true } },
  methods   : { getOrganizationNameById }
}

function getOrganizationNameById (organizationTypeId){
  return this.$store.getters['organizations/typeNameById'](organizationTypeId)
}
</script>
