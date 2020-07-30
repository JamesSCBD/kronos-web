<template>
  <div class="container-fluid">
    <BForm @submit.prevent="contactUpdate">
      <div class="row">
        <div class="col-sm-12">
          <div class="form-group">
            <button class="btn col-sm-2 btn-primary float-right" type="submit">
              Update
            </button>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-6">
          <div class="card">
            <div class="card-header">
              <strong>Main Information</strong>
            </div>
            <div class="card-body">
              <div class="form-group">
                <BFormGroup label="Title">
                  <BFormSelect
                    id="title"
                    v-model="contact.title"
                    class="form-control"
                    :options="titleOptions"
                  />
                </BFormGroup>
              </div>
              <div class="form-group">
                <BFormGroup label="First Name">
                  <BFormInput
                    id="firstName"
                    v-model="contact.firstName"
                    required
                    aria-describedby="input-live-feedback"
                    trim
                    :state="firstNameRequired"
                  />
                  <BFormInvalidFeedback id="input-live-feedback">
                    First name is required.
                  </BFormInvalidFeedback>
                </BFormGroup>
              </div>
              <div class="form-group">
                <BFormGroup label="Last Name">
                  <BFormInput
                    id="lastName"
                    v-model="contact.lastName"
                    trim
                    required
                    :state="lastNameRequired"
                  />
                  <BFormInvalidFeedback id="input-live-feedback">
                    Last name is required.
                  </BFormInvalidFeedback>
                </BFormGroup>
              </div>
              <div class="form-group">
                <BFormGroup label="Job Title">
                  <BFormInput
                    id="jobTitle"
                    v-model="contact.designation"
                    trim
                  />
                </BFormGroup>
              </div>
              <div class="form-group">
                <BFormGroup label="Department">
                  <BFormInput
                    id="department"
                    v-model="contact.department"
                    trim
                  />
                </BFormGroup>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-header">
              <strong>Postal Address</strong>
            </div>
            <div class="card-body">
              <div class="form-group">
                <BFormCheckbox
                  id="useOrgAdd"
                  v-model="contact.isUseOrganizationAddress"
                >
                  Use organization address
                </BFormCheckbox>
              </div>
              <div class="form-group">
                <BFormGroup label="Postal Address">
                  <BFormTextarea
                    id="postalAddress"
                    v-model="contact.address"
                    rows="4"
                    :disabled="contact.isUseOrganizationAddress"
                  />
                </BFormGroup>
              </div>
              <div class="row">
                <div class="col-sm-6">
                  <div class="form-group">
                    <BFormGroup label="Postal Code">
                      <BFormInput
                        id="postalCode"
                        v-model="contact.postalCode"
                        :disabled="contact.isUseOrganizationAddress"
                      />
                    </BFormGroup>
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="form-group">
                    <BFormGroup label="City">
                      <BFormInput
                        id="city"
                        v-model="contact.city"
                        :disabled="contact.isUseOrganizationAddress"
                      />
                    </BFormGroup>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-6">
                  <div class="form-group">
                    <BFormGroup label="Province/State">
                      <BFormInput
                        id="state"
                        v-model="contact.state"
                        :disabled="contact.isUseOrganizationAddress"
                      />
                    </BFormGroup>
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="form-group">
                    <BFormGroup label="Country">
                      <div :class="{ 'invalid': countyRequired }">
                        <CountrySelector v-model="contact.country" :multiple="false" :disabled="contact.isUseOrganizationAddress" />
                        <label v-show="countyRequired" class="typo__label form__label">Please select country</label>
                      </div>
                    </BFormGroup>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <BFormGroup label="Oraganization (If different from the nominating organization)">
                  <BFormInput
                    id="oraganization"
                    :disabled="contact.isUseOrganizationAddress"
                  />
                </BFormGroup>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-6">
          <div class="card">
            <div class="card-header">
              <strong>Phone Numbers and Emails</strong>
            </div>
            <div class="card-body">
              <p>
                Please use the following format: + (country code) (city code) (telephone number)
                (extension, if necessary); Example: +1 514 288-2220 ext 221
                (where 1 = North America, 514 = Montreal, 288-2220 = CBD Secretariat number,
                ext 221 = direct extension to the switchboard).
              </p>
              <div class="row">
                <div class="col-sm-6">
                  <div class="form-group">
                    <BFormGroup label="Phone Numbers">
                      <div v-for="(field, index) in phoneFields" :key="index" class="input-group mb-3">
                        <BFormInput
                          v-model="field.phone"
                          trim
                          :state="isPhoneNumberValid(field.phone)"
                          @input="addPhoneField(field)"
                        />
                        <div v-if="field.showRemoveButton" class="input-group-append">
                          <span class="input-group-text">
                            <a @click="removePhoneField(field)"><CIcon name="trashAlt" /></a>
                          </span>
                        </div>
                        <BFormInvalidFeedback id="input-live-feedback">
                          Phone number is invalid.
                        </BFormInvalidFeedback>
                      </div>
                    </BFormGroup>
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="form-group">
                    <BFormGroup label="Fax Numbers">
                      <div v-for="(field, index) in faxFields" :key="index" class="input-group mb-3">
                        <BFormInput
                          v-model="field.fax"
                          trim
                          :state="isPhoneNumberValid(field.fax)"
                          @input="addFaxField(field)"
                        />
                        <div v-if="field.showRemoveButton" class="input-group-append">
                          <span class="input-group-text">
                            <a @click="removeFaxField(field)"><CIcon name="trashAlt" /></a>
                          </span>
                        </div>
                        <BFormInvalidFeedback id="input-live-feedback">
                          Fax number is invalid.
                        </BFormInvalidFeedback>
                      </div>
                    </BFormGroup>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-6">
                  <div class="form-group">
                    <BFormGroup label="Mobiler Numbers">
                      <div v-for="(field, index) in mobileFields" :key="index" class="input-group mb-3">
                        <BFormInput
                          v-model="field.mobile"
                          trim
                          @input="addMobileField(field)"
                        />
                        <div v-if="field.showRemoveButton" class="input-group-append">
                          <span class="input-group-text">
                            <a @click="removeMobileField(field)"><CIcon name="trashAlt" /></a>
                          </span>
                        </div>
                      </div>
                    </BFormGroup>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-6">
                  <div class="form-group">
                    <BFormGroup label="Primary Email Address">
                      <div v-for="(field, index) in emailFields" :key="index" class="input-group mb-3">
                        <BFormInput
                          v-model="field.email"
                          trim
                          :state="isEmailAddressValid(field.email)"
                          @input="addEmailField(field)"
                        />
                        <div v-if="field.showRemoveButton" class="input-group-append">
                          <span class="input-group-text">
                            <a @click="removeEmailField(field)"><CIcon name="trashAlt" /></a>
                          </span>
                        </div>
                      </div>
                    </BFormGroup>
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="form-group">
                    <BFormGroup label="Email Address to CC">
                      <div v-for="(field, index) in emailCcFields" :key="index" class="input-group mb-3">
                        <BFormInput
                          v-model="field.emailCc"
                          trim
                          :state="isEmailAddressValid(field.emailCc)"
                          @input="addEmailCcField(field)"
                        />
                        <div v-if="field.showRemoveButton" class="input-group-append">
                          <span class="input-group-text">
                            <a @click="removeEmailCcField(field)"><CIcon name="trashAlt" /></a>
                          </span>
                        </div>
                        <BFormInvalidFeedback id="input-live-feedback">
                          Email address is not valid.
                        </BFormInvalidFeedback>
                      </div>
                    </BFormGroup>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-header">
              <strong>Additional Information</strong>
            </div>

            <div class="card-body">
              <div class="form-group">
                <BFormCheckbox
                  id="includeContact"
                  v-model="contact.isInMailingList"
                >
                  Include contact in organization's mailling lists
                </BFormCheckbox>
              </div>
              <div class="row">
                <div class="col-sm-6">
                  <div class="form-group">
                    <BFormGroup label="Date of Birth">
                      <BFormInput
                        id="dob"
                        v-model="dateOfBirth"
                        type="date"
                      />
                    </BFormGroup>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <BFormGroup label="Notes">
                  <BFormTextarea
                    id="notes"
                    v-model="contact.notes"
                  />
                </BFormGroup>
              </div>
              <div class="form-group">
                <BFormGroup
                  label="To copy full contact details into a document, click the button below, and then paste copied text into your document(CTRL-V)."
                >
                  <button class="btn btn-primary" @click="copyToClipboard">
                    Copy contact details to clipboard
                  </button>
                </BFormGroup>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-header">
              <strong>Record Status</strong>
            </div>

            <div class="card-body">
              <div class="form-group">
                <BFormGroup
                  label="Created On:"
                  label-cols-sm="4"
                  label-cols-lg="3"
                >
                  <BFormInput
                    id="createdOn"
                    v-model="createdOn"
                    disabled
                  />
                </BFormGroup>
              </div>
              <div class="form-group">
                <BFormGroup
                  label="Updated On:"
                  label-cols-sm="4"
                  label-cols-lg="3"
                >
                  <BFormInput
                    id="updatedOn"
                    v-model="updatedOn"
                    disabled
                  />
                </BFormGroup>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BForm>
  </div>
</template>

<script>
import {
  BFormInput, BFormGroup, BFormSelect, BFormCheckbox, BFormTextarea,
  BFormInvalidFeedback, BForm,
} from 'bootstrap-vue';
import Copy from 'copy-to-clipboard';
import _ from 'lodash';
import { date } from '~/filters/datetime';
import CountrySelector from '~/components/controls/selectors/CountrySelector';
import { isEmailValid } from '~/filters/emails';

const TITLE_OPTIONS = [
  { value: null, text: '' },
  { value: 'Mr.', text: 'Mr.' },
  { value: 'Ms.', text: 'Ms.' },
  { value: 'H.E. Mr.', text: 'H.E. Mr.' },
  { value: 'H.E. Ms.', text: 'H.E. Ms.' },
  { value: 'Prof.', text: 'Prof.' },
];

export default {
  name      : 'EditContact',
  components: {
    BFormInput,
    BFormGroup,
    BFormSelect,
    BFormCheckbox,
    BFormTextarea,
    CountrySelector,
    BFormInvalidFeedback,
    BForm,
  },
  data() {
    return {
      contactId    : this.$route.params.edit || '',
      contact      : {},
      inputBoxId   : 0,
      titleOptions : [ ...TITLE_OPTIONS ],
      mobileFields : [],
      phoneFields  : [],
      faxFields    : [],
      emailFields  : [],
      emailCcFields: [],
    };
  },
  computed: {
    dateOfBirth: {
      get() { return date(this.contact.dateOfBirth);  },
      set(value) { this.contact.dateOfBirth = value;  },
    },
    createdOn() { return `${date(this.contact.createdOn)} by ${this.contact.createdBy}`; },
    updatedOn() { return `${date(this.contact.updatedOn)} by ${this.contact.updatedBy}`; },
    firstNameRequired() { return this.contact.firstName !== ''; },
    lastNameRequired() { return this.contact.lastName !== ''; },
    countyRequired() { return !this.contact.country && !this.contact.isUseOrganizationAddress; },
  },
  mounted,
  methods: {
    copyToClipboard,
    contactUpdate,
    isEmailValid,
    addMobileField,
    removeMobileField,
    addPhoneField,
    removePhoneField,
    addFaxField,
    removeFaxField,
    addEmailField,
    removeEmailField,
    addEmailCcField,
    removeEmailCcField,
    getNewId,
    isPhoneNumberValid,
    isEmailAddressValid,
  },
};

function isEmailAddressValid(value) {
  if (value !== '') return isEmailValid(value);
  return null;
}

function isPhoneNumberValid(value) {
  if (value !== '') {
    const re = /^\+\d+\s/;
    return re.test(String(value));
  }
  return null;
}

function getNewId() {
  this.inputBoxId++;
  return this.inputBoxId;
}

// ////////////
// EamilCcs //
// ////////////
function addEmailCcField(f) {
  const field = f;
  if (!field.showRemoveButton) {
    this.emailCcFields.push({ emailCc: '', showRemoveButton: false, id: this.getNewId() });
    field.showRemoveButton = true;
  }
}

function removeEmailCcField(field) {
  this.emailCcFields = _.remove(this.emailCcFields, (n) => n.id !== field.id);
}

// ////////////
// Eamil //
// ////////////
function addEmailField(f) {
  const field = f;
  if (!field.showRemoveButton) {
    this.emailFields.push({ email: '', showRemoveButton: false, id: this.getNewId() });
    field.showRemoveButton = true;
  }
}

function removeEmailField(field) {
  this.emailFields = _.remove(this.emailFields, (n) => n.id !== field.id);
}

// ////////////
// Fax //
// ////////////
function addFaxField(f) {
  const field = f;
  if (!field.showRemoveButton) {
    this.faxFields.push({ fax: '', showRemoveButton: false, id: this.getNewId() });
    field.showRemoveButton = true;
  }
}

function removeFaxField(field) {
  this.faxFields = _.remove(this.faxFields, (n) => n.id !== field.id);
}

// ////////////
// Phone //
// ////////////
function addPhoneField(f) {
  const field = f;
  if (!field.showRemoveButton) {
    this.phoneFields.push({ phone: '', showRemoveButton: false, id: this.getNewId() });
    field.showRemoveButton = true;
  }
}

function removePhoneField(field) {
  this.phoneFields = _.remove(this.phoneFields, (n) => n.id !== field.id);
}

// ////////////
// Mobile //
// ////////////
function addMobileField(f) {
  const field = f;
  if (!field.showRemoveButton) {
    this.mobileFields.push({ mobile: '', showRemoveButton: false, id: this.getNewId() });
    field.showRemoveButton = true;
  }
}

function removeMobileField(field) {
  this.mobileFields = _.remove(this.mobileFields, (n) => n.id !== field.id);
}

async function mounted() {
  const result = await this.$kronosApi.getContact(this.contactId);
  this.contact = result;

  this.contact.phones.forEach((phone) => {
    this.phoneFields.push({ phone, showRemoveButton: true, id: this.getNewId() });
  });

  this.contact.mobiles.forEach((mobile) => {
    this.mobileFields.push({ mobile, showRemoveButton: true, id: this.getNewId() });
  });

  this.contact.faxes.forEach((fax) => {
    this.faxFields.push({ fax, showRemoveButton: true, id: this.getNewId() });
  });

  this.contact.emails.forEach((email) => {
    this.emailFields.push({ email, showRemoveButton: true, id: this.getNewId() });
  });

  this.contact.emailCcs.forEach((emailCc) => {
    this.emailCcFields.push({ emailCc, showRemoveButton: true, id: this.getNewId() });
  });

  this.mobileFields.push({ mobile: '', showRemoveButton: false, id: this.getNewId() });
  this.phoneFields.push({ phone: '', showRemoveButton: false, id: this.getNewId() });
  this.faxFields.push({ fax: '', showRemoveButton: false, id: this.getNewId() });
  this.emailFields.push({ email: '', showRemoveButton: false, id: this.getNewId() });
  this.emailCcFields.push({ emailCc: '', showRemoveButton: false, id: this.getNewId() });
}

function contactUpdate(event) {
  const form = event.currentTarget;
  if (!form.checkValidity()) {
    return;
  }
  if (this.countyRequired) return;
  console.log('submit');
}

function copyToClipboard() {
  const copyDetails =  `${this.contact.title} ${this.contact.firstName} ${this.contact.lastName}`;
  Copy(copyDetails);
}

</script>

<style>
.form-control:disabled {
  background-color: unset;
}
.invalid .typo__label{
  color: #e55353;;
}
.invalid .multiselect__tags {
  border-color: #e55353!important;
}
</style>
