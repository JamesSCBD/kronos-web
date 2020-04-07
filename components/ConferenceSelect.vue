<template>
  <multiselect
    v-model="value"
    :options="options"
    :searchable="false"
    :allow-empty="false"
    :on-select="onSelect"
    deselect-label="Can't remove this value"
    track-by="code"
    label="title"
    style="margin-top: .05em"
  >
    <template slot="singleLabel" slot-scope="{ option }">
      <strong>{{ option.title }}</strong>
    </template>
  </multiselect>
</template>

<script>
import Multiselect from 'vue-multiselect'
import { mapGetters } from 'vuex'

export default {
  name      : 'ConferenceSelect',
  components: { Multiselect },
  computed  : { ...gettersMap() },
  methods   : { onSelect }
}

function onSelect (option){
  console.log(option)
}

function gettersMap (){
  return mapGetters({
    options: 'conferences/list',
    value  : 'conferences/list'
  })
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
