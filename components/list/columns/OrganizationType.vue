<template>
  <div class="text-left">
    {{ getOrganizationTypeNameById(organizationTypeId) }}
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props   : { organizationTypeId: { type: String, required: true } },
  computed: {
    ...mapGetters({ getTypeById: 'organizations/getTypeById' }),
  },
  methods: { getOrganizationTypeNameById },
};

function getOrganizationTypeNameById(organizationTypeId) {
  const  organizationType = this.getTypeById(organizationTypeId);
  return  (organizationType || {}).title || organizationTypeId;
}
</script>
