<template>
  <div class="text-left">
    <!-- <CountryFlag :country="code" />
    <br> -->
    {{ getEmailAddress(emails) }}
  </div>
</template>

<script>
// import CountryFlag from 'vue-country-flag'

export default {
  components: {  },
  props     : { emails: { type: Array, required: true } },
  methods   : { getEmailAddress }
}

function getEmailAddress (emails){
  if (emails.length > 0)
    return emails[0]
  else
    return ''
}
</script>
