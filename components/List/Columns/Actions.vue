<template>
  <div>
    <nuxt-link v-if="editPath" :to="editPath" class="btn btn-outline-dark btn-sm">
      <CIcon name="edit" />
    </nuxt-link>
    <button v-if="remove" type="button" class="btn btn-outline-dark btn-sm" @click="remove(identifier)">
      <CIcon name="trashAlt" />
    </button>
  </div>
</template>

<script>
import { CIcon } from '@coreui/vue';

export default {
  components: { CIcon },
  props     : {
    identifier: { type: String, required: true },
    remove    : { type: [ Function, undefined ], default: undefined },
    editPath  : { type: String, default: '' },
  },
};

</script>
