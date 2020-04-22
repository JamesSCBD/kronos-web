<template>
  <div class="container-fluid">
    <div class="row ">
      <div class="col-12">
        Edit:
        <pre>
          {{ organization }}
        </pre>
      </div>
    </div>
  </div>
</template>

<script>

import { readOnly } from '@roles';

export default {
  name   : 'EditOrganization',
  data   : init,
  mounted: load,
  auth   : readOnly,

};

function init() {
  return {
    identifier  : this.$route.params.identifier,
    organization: {},
  };
}

async function load() {
  this.organization = await this.$kronosApi.getOrganization(this.identifier);
}

</script>
