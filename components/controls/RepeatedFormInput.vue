<template>
  <div>
    <BFormGroup :label="label">
      <div v-for="(field, index) in inputFieldsList" :key="index" class="input-group mb-3">
        <BFormInput
          v-model="field.value"
          trim
          :state="validateInputField(field.value)"
          @input="addInputField"
        />
        <div v-if="field.showRemoveButton" class="input-group-append">
          <span class="input-group-text">
            <a @click="removeInputField(field)"><CIcon name="trashAlt" /></a>
          </span>
        </div>
        <BFormInvalidFeedback id="input-live-feedback">
          {{ invalidFeedback }}
        </BFormInvalidFeedback>
      </div>
    </BFormGroup>
  </div>
</template>

<script>
import {
  BFormInput, BFormGroup, BFormInvalidFeedback,
} from 'bootstrap-vue';
import _ from 'lodash';
import { isEmailValid } from '~/filters/emails';

export default {
  name      : 'RepeatedFormInput',
  components: { BFormInput, BFormGroup, BFormInvalidFeedback },
  props     : {
    label: {
      type   : String,
      default: '',
    },
    value: {
      type   : Array,
      default: () => ([]),
    },
    fieldType: {
      type   : String,
      default: null,
    },
    invalidFeedback: {
      type   : String,
      default: '',
    },
  },
  computed: {
    inputFieldsList: {
      get() {
        return this.getInputFieldsList(this.value);
      },
      set(value) {
        const values = value.map((field1) => field1.value);
        this.$emit('input',  _.initial(values));
      },
    },
  },
  methods: {
    addInputField,
    removeInputField,
    getInputFieldsList,
    getUniqueId,
    isPhoneNumberValid,
    validateInputField,
    isEmailAddressValid,
    isEmailValid,
  },
};

function validateInputField(value) {
  if (this.fieldType === 'phoneNumber') {
    return this.isPhoneNumberValid(value);
  }
  if (this.fieldType === 'email') {
    return this.isEmailAddressValid(value);
  }
  return null;
}

function isPhoneNumberValid(value) {
  if (value !== '') {
    const re = /^\+\d+\s/;
    return re.test(String(value));
  }
  return null;
}

function isEmailAddressValid(value) {
  if (value !== '') return isEmailValid(value);
  return null;
}

function getInputFieldsList(values) {
  const list = [];
  values.forEach((value) => {
    list.push({ value, showRemoveButton: true, id: this.getUniqueId() });
  });
  list.push({ value: '', showRemoveButton: false, id: this.getUniqueId() });
  return list;
}

function getUniqueId() {
  return `_${Math.random().toString(36).substr(2, 9)}`;
}

function addInputField() {
  const values = this.inputFieldsList.map((field1) => field1.value);
  this.$emit('input',  _.compact(values));
}

function removeInputField(field) {
  this.inputFieldsList = _.remove(this.inputFieldsList, (n) => n.id !== field.id);
}
</script>
