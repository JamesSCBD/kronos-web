<template>
  <div class="container-fluid">
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
                />
              </BFormGroup>
            </div>
            <div class="form-group">
              <BFormGroup label="Last Name">
                <BFormInput
                  id="lastName"
                  v-model="contact.lastName"
                />
              </BFormGroup>
            </div>
            <div class="form-group">
              <BFormGroup label="Job Title">
                <BFormInput
                  id="jobTitle"
                  v-model="contact.designation"
                />
              </BFormGroup>
            </div>
            <div class="form-group">
              <BFormGroup label="Department">
                <BFormInput
                  id="department"
                  v-model="contact.department"
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
                    <CountrySelector v-model="contact.country" :multiple="false" :disabled="contact.isUseOrganizationAddress" />
                    <!-- <BFormInput
                      id="country"
                      v-model="contact.country"
                      :disabled="contact.isUseOrganizationAddress"
                    /> -->
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
            <div class="row">
              <div class="col-sm-6">
                <div class="form-group">
                  <BFormGroup label="Phone Numbers">
                    <BFormInput
                      id="phoneNumbers"
                      v-model="phones"
                    />
                  </BFormGroup>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="form-group">
                  <BFormGroup label="Fax Numbers">
                    <BFormInput
                      id="faxNumbers"
                      v-model="faxes"
                    />
                  </BFormGroup>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-6">
                <div class="form-group">
                  <BFormGroup label="Mobiler Numbers">
                    <BFormInput
                      id="mobileNumbers"
                      v-model="mobiles"
                    />
                  </BFormGroup>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-6">
                <div class="form-group">
                  <BFormGroup label="Primary Email Address">
                    <BFormInput
                      id="email"
                      v-model="emails"
                    />
                  </BFormGroup>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="form-group">
                  <BFormGroup label="Email Address to CC">
                    <BFormInput
                      id="emailCCs"
                      v-model="emailCcs"
                    />
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
              <BFormGroup label="To copy full contact details into a document, click the button below, and then paste copied text into your document(CTRL-V).">
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
  </div>
</template>

<script>
import {
  BFormInput, BFormGroup, BFormSelect, BFormCheckbox, BFormTextarea,
} from 'bootstrap-vue';
import Copy from 'copy-to-clipboard';
import { date } from '~/filters/datetime';
import CountrySelector from '~/components/controls/selectors/CountrySelector';

const TITLE_OPTIONS = [
  { value: 'Mr.', text: 'Mr.' },
  { value: 'Ms.', text: 'Ms.' },
  { value: 'H.E. Mr.', text: 'H.E. Mr.' },
  { value: 'H.E. Ms.', text: 'H.E. Ms.' },
  { value: 'Prof.', text: 'Prof.' },
];

export default {
  name      : 'EditContact',
  components: {
    BFormInput, BFormGroup, BFormSelect, BFormCheckbox, BFormTextarea, CountrySelector,
  },
  data() {
    return {
      contactId   : this.$route.params.edit || '',
      contact     : {},
      titleOptions: [ ...TITLE_OPTIONS ],
    };
  },
  computed: {
    dateOfBirth: {
      get() { return date(this.contact.dateOfBirth);  },
      set(value) { this.contact.dateOfBirth = value;  },
    },
    phones: {
      get() { return String(this.contact.phones);  },
      set(value) { this.contact.phones = [ value ];  },
    },
    mobiles: {
      get() { return String(this.contact.mobiles);  },
      set(value) { this.contact.mobiles = [ value ];  },
    },
    faxes: {
      get() { return String(this.contact.faxes);  },
      set(value) { this.contact.faxes = [ value ];  },
    },
    emails: {
      get() { return String(this.contact.emails);  },
      set(value) { this.contact.emails = [ value ];  },
    },
    emailCcs: {
      get() { return String(this.contact.emailCcs);  },
      set(value) { this.contact.emailCcs = [ value ];  },
    },
    createdOn() { return `${date(this.contact.createdOn)} by ${this.contact.createdBy}`; },
    updatedOn() { return `${date(this.contact.updatedOn)} by ${this.contact.updatedBy}`; },
  },
  mounted,
  methods: {
    copyToClipboard,
  },
};

async function mounted() {
  const query       = { contactId: this.contactId, limit: 5 };
  const result      = await this.$kronosApi.queryContacts(query);
  const contactData = result.records;
  this.contact      = contactData[0]; // eslint-disable-line prefer-destructuring
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
</style>
