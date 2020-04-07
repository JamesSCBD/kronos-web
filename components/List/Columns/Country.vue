<template>
  <div class="text-left">
    <!-- <CountryFlag :country="code" />
    <br> -->
    {{ getNameByCode(code) }}
  </div>
</template>

<script>
// import CountryFlag from 'vue-country-flag'

export default {
  components: {  },
  props     : { code: { type: String, required: true } },
  methods   : { getNameByCode }
}

function getNameByCode (code){
  return this.$store.getters['countries/getNameByCode'](code)
}
</script>
