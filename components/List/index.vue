<template>
  <component :is="aComponent" v-if="aComponent" v-bind="$props" />
</template>
<script>

export default {
  props: {
    type      : { type: String, default: 'default' },
    tableItems: { type: [ Array, Function ], required: true },
    loading   : { type: Boolean, required: true }
  },
  data,
  created
}

const getComp = async (type) => {
  if (type === 'contacts')
    return (await import(/* webpackChunkName: "contacts-list" */ './ContactsList.vue')).default
  if (type === 'organizations')
    return (await import(/* webpackChunkName: "organizations-list" */ './OrganizationsList.vue')).default
  if (type === 'conferences')
    return (await import(/* webpackChunkName: "conferences-list" */ './ConferencesList.vue')).default
}

async function created (){ this.aComponent = await getComp(this.type) }

function data (){ return { aComponent: '' } }

</script>
