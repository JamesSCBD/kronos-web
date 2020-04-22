<template>
  <div class="container-fluid">
    <div class="row ">
      <div class="col-12">
        Edit:
        <pre>
          {{ contact }}
        </pre>
      </div>
    </div>
  </div>
</template>

<script>
import { user } from '@roles';

export default {
  name   : 'EditContact',
  data,
  mounted: load,
  auth   : user,
};

function data() {
  const { identifier } = this.$route.params;
  const contact        = {};

  return { identifier, contact };
}

async function load() {
  this.contact = await this.$kronosApi.getContact(this.identifier);
}
</script>
