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
                    <RepeatedFormInput
                      v-model="contact.phones"
                      label="Phone Numbers"
                      field-type="phoneNumber"
                      invalid-feedback="Phone number is invalid."
                    />
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="form-group">
                    <RepeatedFormInput
                      v-model="contact.faxes"
                      label="Fax Numbers"
                      field-type="phoneNumber"
                      invalid-feedback="Fax number is invalid."
                    />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-6">
                  <div class="form-group">
                    <RepeatedFormInput
                      v-model="contact.mobiles"
                      label="Mobile Numbers"
                      field-type="phoneNumber"
                      invalid-feedback="Mobile number is invalid."
                    />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-6">
                  <div class="form-group">
                    <RepeatedFormInput
                      v-model="contact.emails"
                      label="Primary Email Address"
                      field-type="email"
                      invalid-feedback="Email address is not valid"
                    />
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="form-group">
                    <RepeatedFormInput
                      v-model="contact.emailCcs"
                      label="Primary Email Address"
                      field-type="email"
                      invalid-feedback="Email address is not valid"
                    />
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
                Created On: {{ contact.createdOn | date }} by {{ contact.createdBy }}
              </div>
              <div class="form-group">
                Updated On: {{ contact.updatedOn | date }} by {{ contact.updatedBy }}
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
import { date } from '~/filters/datetime';
import CountrySelector from '~/components/controls/selectors/CountrySelector';
import RepeatedFormInput from '~/components/controls/RepeatedFormInput';

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
    RepeatedFormInput,
  },
  data() {
    return {
      contactId   : this.$route.params.edit || '',
      contact     : {},
      inputBoxId  : 0,
      titleOptions: [ ...TITLE_OPTIONS ],
    };
  },
  computed: {
    dateOfBirth: {
      get() { return date(this.contact.dateOfBirth);  },
      set(value) { this.contact.dateOfBirth = value;  },
    },
    firstNameRequired() { return this.contact.firstName !== ''; },
    lastNameRequired() { return this.contact.lastName !== ''; },
    countyRequired() { return !this.contact.country && !this.contact.isUseOrganizationAddress; },
  },
  mounted,
  methods: {
    copyToClipboard,
    contactUpdate,
  },
};

async function mounted() {
  const result = await this.$kronosApi.getContact(this.contactId);
  this.contact = result;
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
