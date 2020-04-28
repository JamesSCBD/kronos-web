<template>
  <div>
    <multiselect
      v-model="selectedAttendances"
      label="Title"
      track-by="Value"
      placeholder="Attendance "
      open-direction="bottom"
      :options="attendanceOptions"
      :multiple="multiple"
      :clear-on-select="false"
      :close-on-select="!multiple"
      :show-no-results="false"
    >
      <template slot="tag" slot-scope="{ option, remove }">
        <span class="multiselect__tag">
          <span>{{ option.Title.substr(0,3) }}</span>
          <i aria-hidden="true" tabindex="1" class="multiselect__tag-icon" @click="remove(option)" />
        </span>
      </template>

      <template slot="clear">
        <div
          v-if="selectedAttendances.length"
          class="multiselect__clear"
          @mousedown.prevent.stop="selectedAttendances = null"
        />
      </template>
    </multiselect>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import SelectorsMixin  from './SelectorsMixin';

const Attendances = [
  { Title: 'Nominated',  Value: 1 << 0 }, // eslint-disable-line no-bitwise
  { Title: 'Accredited', Value: 1 << 1 }, // eslint-disable-line no-bitwise
  { Title: 'Registered', Value: 1 << 2 }, // eslint-disable-line no-bitwise
];

export default {
  name      : 'RegistrationStatusSelector',
  components: { Multiselect },
  mixins    : [ SelectorsMixin ],
  props     : {
    value: {
      type: [ Number, Array ],
      default() {
        return [];
      },
      validator(value) {
        if (Array.isArray(value)) {
          if (value.length) {
            return value.every((x) => Attendances.some((a) => a.Value === x));
          }
          return true;
        }
        return Attendances.some((a) => a.Value === value);
      },
    },
  },
  computed: {
    selectedAttendances: {
      get() {
        return this.asArray(this.value).map((value) => this.attendanceOptions.find((option) => option.Value === value) || { Value: value, isMissing: true });
      },
      set(attendances) {
        const values = this.asArray(attendances).map((attendance) => attendance.Value);
        this.$emit('input', this.multiple ? values : values[0]);
      },
    },
    attendanceOptions: { get: () => Attendances },
  },
};
</script>
