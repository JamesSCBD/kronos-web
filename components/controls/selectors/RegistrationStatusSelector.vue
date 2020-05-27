<template>
  <div>
    <multiselect
      v-model="selectedAttendances"
      label="title"
      track-by="value"
      placeholder="Attendance "
      open-direction="bottom"
      :options="attendanceOptions"
      :multiple="multiple"
      :clear-on-select="false"
      :close-on-select="!multiple"
      :show-no-results="false"
      :disabled="disabled"
    >
      <template slot="tag" slot-scope="{ option, remove }">
        <span class="multiselect__tag">
          <span>{{ option.title.substr(0,3) }}</span>
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
  { title: 'Nominated',  value: 1 << 0 }, // eslint-disable-line no-bitwise
  { title: 'Accredited', value: 1 << 1 }, // eslint-disable-line no-bitwise
  { title: 'Registered', value: 1 << 2 }, // eslint-disable-line no-bitwise
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
            return value.every((x) => Attendances.some((a) => a.value === x));
          }
          return true;
        }
        return Attendances.some((a) => a.value === value);
      },
    },
    disabled: {
      type   : Boolean,
      default: false,
    },
  },
  computed: {
    selectedAttendances: {
      get() {
        return this.asArray(this.value).map((value) => this.attendanceOptions.find((option) => option.value === value) || { value, isMissing: true });
      },
      set(attendances) {
        const values = this.asArray(attendances).map((attendance) => attendance.value);
        this.$emit('input', this.multiple ? values : values[0]);
      },
    },
    attendanceOptions: { get: () => Attendances },
  },
  watch: { disabled(value) { if (value) this.selectedAttendances = null; } },
};
</script>
