<template>
  <div class="container-fluid">
    <div class="row ">
      <div class="col-12">
        dashboard
      </div>
    </div>
  </div>
</template>

<script>
import { user } from '@roles';

export default {
  name: 'ConferenceDashboard',
  auth: user,
};
</script>
