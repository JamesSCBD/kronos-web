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
import { mapGetters } from 'vuex';
import Multiselect from 'vue-multiselect';

export default {
  name      : 'ConferenceSelect',
  components: { Multiselect },
  computed  : { ...gettersMap() },
  methods   : { onSelect },
};

function onSelect(option) {
  console.log(option);
}

function gettersMap() {
  return mapGetters({
    options: 'conferences/list',
    value  : 'conferences/list',
  });
}
</script>
