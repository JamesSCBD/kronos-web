<template>
  <div class="text-center">
    <CountryFlag :country="code" />
    <br>
    {{ getNameByCode(code) }}
  </div>
</template>

<script>
import CountryFlag from 'vue-country-flag'

export default {
  components: { CountryFlag },
  props     : { code: { type: String, required: true } },
  methods   : { getNameByCode }
}

function getNameByCode (code){
  return this.$store.getters['countries/nameByCode'](code)
}
</script>
