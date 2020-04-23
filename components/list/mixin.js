import {
  BTable, BFormSelect, BPagination, BFormCheckbox,
} from 'bootstrap-vue';
import { CIcon } from '@coreui/vue';
import { CountryCol, EmailCol, OrganizationTypeCol } from './columns';

const components = {
  BTable, CountryCol, CIcon, BFormSelect, BPagination, BFormCheckbox, EmailCol, OrganizationTypeCol,
};

export default { components };
