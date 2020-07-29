<template>
  <div class="container-fluid">
    <div class="export-task">
      <BTable
        id="reportList"
        :items="items"
        :fields="columns"
        class="mb-0 list w-100"
        responsive="md"
        striped
        small
        bordered
      >
        <template v-slot:cell(action)>
          <button class="btn btn-primary" @click="generateReport()">
            Download
          </button>
        </template>
      </BTable>
    </div>
  </div>
</template>

<script>
import { BTable } from 'bootstrap-vue';
import { saveAs } from 'file-saver';
import _ from 'lodash';
import ky from 'ky';
import { DateTime } from 'luxon';
import Handlebars from 'handlebars';
import { formatDate, date } from '~/filters/datetime';
import { enableCursor }  from '~/api/kronos';

const COLUMNS = [
  { key: 'name', label: 'Name', sortable: false },
  { key: 'type', label: 'Type', sortable: false },
  { key: 'action', label: 'Action', sortable: false },
];

const REPORTS_NAME = [{ name: 'List of Participant', type: 'LoP', action: '' }];

export default {
  name            : 'ListOfParticipant',
  components      : { BTable },
  reportAttributes: {
    caption: 'List of Participant',
  },
  data() {
    return {
      columns: [ ...COLUMNS ],
      items  : [ ...REPORTS_NAME ],
    };
  },
  methods: {
    generateReport,
  },
};

async function generateReport() {
  const authenticationToken = this.$auth.token; // Simulate server-side call. normally must be loaded from http server request

  const reportOptions = {               // Simulate server-side passed options
    eventId            : '0000000052000000cbd0495c00001740', // WG2020-02
    organizationTypeIds: [
      '0000000052000000cbd05ebe00000003', // Governments
      '0000000052000000cbd05ebe00000004', // United Nations and Specialized Agencies
      '0000000052000000cbd05ebe0000001d', // Local Authorities
      '0000000052000000cbd05ebe00000005', // Inter-Governmental Organizations
      '0000000052000000cbd05ebe00000006', // Non-Governmental Organizations
      '0000000052000000cbd05ebe00000007', // Indigenous Peoples and Local Community Organizations
      '0000000052000000cbd05ebe00000008', // Business
      '0000000052000000cbd05ebe00000009', // Academic/Research
      '0000000052000000cbd05ebe0000002a', // Youth
      '0000000052000000cbd05ebe0000000a', // Observers
    ],
  };

  // load DATA:

  const reportData = await loadData(reportOptions, authenticationToken);
  const template   = await ky.get('/report-templates/cbd-list-of-participants.html').text();
  const render     = createHandlebarsInstance().compile(template);

  const reportHtml = render(reportData);

  saveToPdf(reportHtml);
}

async function loadData({ eventId, organizationTypeIds }, token) {
  // Pass parent token to new ky instance - To be used on server side

  const http = createApiAuthenticatedHttpClient(token);

  // load data

  const query = {
    eventIds          : [ eventId ],
    registrationStatus: 4, // 4==Registered
    organizationTypeIds,
    limit             : 100,
  };

  const participantHanlder = async (q) => http.get('api/v2018/contacts', { searchParams: { q: JSON.stringify(q) } }).json();

  const institution        = await http.get('api/v2018/institutions/current').json();
  const countries          = await http.get('api/v2018/countries').json();
  const organizationsTypes = await http.get('api/v2018/organizations/types').json();
  const event              = await http.get(`api/v2018/events/${encodeURIComponent(eventId)}`).json();
  const participantResults = enableCursor({}, query, participantHanlder);
  const cursor             = participantResults.getCursor();

  const reportData = {
    institution,
    event,
    sections   : [],
    generatedOn: date(new Date()),
  };

  let record = null;

  while (record = await cursor.next()) { // eslint-disable-line no-cond-assign, no-await-in-loop
    // vvv lookup section vvv

    // eslint-disable-next-line no-loop-func
    const organizationsType = organizationsTypes.find((o) => o.organizationTypeId === record.organization.organizationTypeId);
    const sectionInfo       = {
      id      : organizationsType.organizationTypeId,
      code    : organizationsType.acronym,
      position: organizationsType.position,
      title   : organizationsType.title,
    };

    if (organizationsType.acronym === 'GOV') {
      if (isParty(record.organization.government)) {
        sectionInfo.id    = `${organizationsType.organizationTypeId}-PARTIES`;
        sectionInfo.title = 'Parties';
      } else {
        sectionInfo.id       = `${organizationsType.organizationTypeId}-NON-PARTIES`;
        sectionInfo.title    = 'Non-Parties';
        sectionInfo.position = organizationsType.position + 1;
      }
    }

    let section = reportData.sections.find((o) => o.id === sectionInfo.id);

    if (!section) {
      section = { ...sectionInfo, organizations: [] };
      reportData.sections.push(section);
    }

    // ^^^ lookup section ^^^

    // vvv lookup organizations vvv

    let organizationInfo = {
      organizationId: record.organization.organizationId,
      name          : record.organization.name,
    };

    if (organizationsType.acronym === 'GOV') {
      const gorverment = countries.find((o) => o.code === record.organization.government); // eslint-disable-line no-loop-func

      organizationInfo = {
        organizationId: gorverment.code,
        name          : gorverment.name,
      };
    }

    let organization = section.organizations.find((o) => o.organizationId === organizationInfo.organizationId);

    if (!organization) {
      organization = { ...organizationInfo, participants: [] };
      section.organizations.push(organization);
    }

    // ^^^ lookup organizations ^^^

    // vvv Add participants vvv

    const participant = { ...record };

    if (participant.country) participant.countryName = (countries.find((o) => o.code === participant.country) || {}).name;

    organization.participants.push(participant);

    // ^^^ Add participants ^^^

    // if (cursor.skip > 250) break; // Test for 250 records only
  }

  // vvv SORT  vvv

  reportData.sections = _.sortBy(reportData.sections, 'position');
  reportData.sections.forEach((section) => {
    section.organizations = _.sortBy(section.organizations, (o) => `${o.name}`.toLowerCase()); // eslint-disable-line no-param-reassign
    section.organizations.forEach((organization) => {
      // eslint-disable-next-line no-param-reassign
      organization.participants = _.sortBy(organization.participants, (o) => `${o.firstName} ${o.lastName}`.toLowerCase());
      // Participants must be sorted using reg position
    });
  });

  return reportData;
}

function isParty(government) {
  if (government === 'us') return false; // TODO
  if (government === 'va') return false; // TODO

  return !!government;
}

function createApiAuthenticatedHttpClient(token) {
  return ky.create({
    prefixUrl: process.env.NUXT_ENV_KRONOS_API,
    hooks    : { beforeRequest: [ (request) => { request.headers.set('Authorization', `Token ${token}`); } ] },
  });
}

function createHandlebarsInstance() {
  const hb = Handlebars.create(); // Creates an isolated Handlebars environment to avoid global registrations

  hb.registerHelper('longDate', (value) => formatDate(value, 'dd LLLL yyyy'));

  hb.registerHelper('longDateRange', (startDate, endDate) => {
    const startMonth = new Date(startDate).getMonth();
    const endMonth   = new Date(endDate).getMonth();
    const startYear  = new Date(startDate).getFullYear();
    const endYear    = new Date(endDate).getFullYear();

    if (startMonth === endMonth) {
      return `${formatDate(startDate, 'dd')} - ${formatDate(endDate, 'dd LLLL yyyy')}`;
    }

    if (startYear === endYear) {
      return `${formatDate(startDate, 'dd LLLL')} - ${formatDate(endDate, 'dd LLLL yyyy')}`;
    }

    return `${formatDate(startDate, 'dd LLLL yyyy')} - ${formatDate(endDate, 'dd LLLL yyyy')}`;
  });

  return hb;
}

async function saveToPdf(reportHtml) {
  try {
    const now      = DateTime.fromJSDate(new Date());
    const filename = `list-of-participants-${now.toFormat('yyyy-MM-dd')}T${now.toFormat('HH-mm-ss')}.pdf`;

    const pdf = await ky.post('http://localhost:7070/api/render?media=print', {
      body   : reportHtml,
      headers: { 'content-type': 'text/html; charset=UTF-8' },
    }).blob();

    saveAs(new Blob([ pdf ], { type: 'application/pdf' }), filename);
  } catch (errors) {
    if (Array.isArray(errors)) {
      console.log(errors);
    } else {
      throw errors;
    }
  }
}

</script>
