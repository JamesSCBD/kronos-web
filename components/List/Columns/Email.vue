<template>
  <div class="text-left">
    <!-- <CountryFlag :country="code" />
    <br> -->
    {{ getEmailAddress(email) }}
  </div>
</template>

<script>
// import CountryFlag from 'vue-country-flag'

export default {
  components: {  },
  props     : { email: { type: Array, required: true } },
  methods   : { getEmailAddress }
}

function getEmailAddress (email){
  if (email.length > 0)
    return email[0]
  else
    return ''
}
</script>
