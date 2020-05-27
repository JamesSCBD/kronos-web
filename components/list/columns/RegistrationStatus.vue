<template>
  <div :class="{ [StatusClasses[registrationStatus.status]] : true }">
    <span>{{ registrationStatus.date | datetime }}</span>
    <span v-if="registrationStatus.isFunded">$</span>
  </div>
</template>

<script>

const StatusClasses = {
  1: 'nominated-text',
  2: 'accredited-text',
  4: 'registered-text',
};

export default {
  props: { registrationStatus: { type: [ Object ], required: true, default: () => ({}) } },
  data() {
    return {
      StatusClasses,
    };
  },
};
</script>
