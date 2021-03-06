import ky from 'ky';

export default class {
  constructor(tokenReader) {
    this.http = ky.create({
      prefixUrl: process.env.NUXT_ENV_KRONOS_API,
      timeout  : 30 * 1000, // 30 sec
      hooks    : {
        beforeRequest: [
          (request) => {
            request.headers.set('Authorization', `Token ${tokenReader()}`);
          },
        ],
      },
    });
  }

  // ====================
  //
  // ====================
  async getCountries() {
    const data = await this.http.get('api/v2018/countries').json();

    return data;
  }

  // ====================
  //
  //
  // ====================
  async queryContacts(query) {
    const searchParams = toURLSearchParams({ q: query });

    const data = await this.http.get('api/v2018/contacts', { searchParams }).json();

    return enableCursor(data, query, (q) => this.queryContacts(q));
  }

  // ====================
  //
  // ====================
  async getContact(id) {
    const data = await this.http.get(`api/v2018/contacts/${encodeURIComponent(id)}`).json();

    return data;
  }

  // ====================
  // Delete contacts
  // ====================
  async deleteContact(contactId) {
    const data = await this.http.delete(`api/v2018/contacts/${encodeURIComponent(contactId)}`);

    return data;
  }

  // ====================
  //
  // ====================
  async queryOrganizations(query) {
    const searchParams = toURLSearchParams({ q: query });

    const data = await this.http.get('api/v2018/organizations', { searchParams }).json();

    return enableCursor(data, query, (q) => this.queryOrganizations(q));
  }

  // ====================
  //
  // ====================
  async getOrganization(id) {
    const data = await this.http.get(`api/v2018/organizations/${encodeURIComponent(id)}`).json();

    return data;
  }

  // ====================
  // Get organization types
  // ====================
  async getOrganizationTypes() {
    const data = await this.http.get('api/v2018/organizations/Types').json();

    return data;
  }

  // ====================
  // Delete Organization
  // ====================
  async deleteOrganization(organizationId) {
    const data = await this.http.delete(`api/v2018/organizations/${encodeURIComponent(organizationId)}`, { timeout: 2 * 60 * 1000 });

    return data;
  }

  // ====================
  //
  // ====================
  async queryConferences(query) { // eslint-disable-line class-methods-use-this
    // TODO Implements conference on Kronos API

    const searchParams = toURLSearchParams({
      q: { ...query, ...{ institution: 'CBD' } }, // TODO remove institution filter
      s: { StartDate: -1 },
    });

    const data = await ky.get(`${process.env.NUXT_ENV_API}/api/v2016/conferences`, { searchParams }).json();
    return {
      records         : data,
      recordCount     : data.length,
      totalRecordCount: data.length,
    };
  }

  // ====================
  //
  //
  // ====================
  async queryEvents(query) {
    const searchParams = toURLSearchParams({ q: query });

    const data = await this.http.get('api/v2018/events', { searchParams }).json();
    return data;
  }

  async getInstitution() {
    const data = await this.http.get('api/v2018/institutions/current').json();

    return data;
  }
}

// ====================
//
// ====================
function toURLSearchParams(params) {
  if (!params) return undefined;

  const urlEncodedUrlParams = {};
  const paramKeys           = Object.keys(params);

  paramKeys.forEach((key) => {
    let value = params[key];

    if (value instanceof Object) value = JSON.stringify(value, null, '');
    else if (value instanceof Date) value = value.toISOString();

    urlEncodedUrlParams[key] = value;
  });

  return new URLSearchParams(urlEncodedUrlParams);
}

export function enableCursor(result, query, queryHandler) {
  return { ...result, getCursor: (options = {}) => createCursor(result, query, queryHandler, options) };
}

// ====================
//
// ====================
function createCursor(result, query, queryHandler, options) {
  const { totalRecordCount } = result;
  let   limit                = Math.max(result.limit || (query || {}).limit || 0, 50);
  let   skip                 = result.skip || (query || {}).skip  || 0;

  let records = [ ...result.records || [] ];

  // Apply user options;
  if (options.skip >= 0) {
    if (options.skip < skip) records = []; // seeking before buffered start => need to reset buffer

    skip = options.skip;
    records.splice(0, skip); // seeking buffer to user defined start
  }

  if (options.limit > 0) {
    limit = options.limit;
  }

  return {
    get totalRecordCount() {
      return totalRecordCount;
    },

    get skip() {
      return skip;
    },

    get limit() {
      return limit;
    },

    async next() {
      if (!records.length && query) {
        console.log(`Loading records ${skip} to ${skip + limit} of ${totalRecordCount}`);
        const nextResult = await queryHandler({ ...query, skip, limit });
        records          = [ ...nextResult.records ];
      }

      const nextRecord = records.splice(0, 1)[0];

      skip++;

      return nextRecord;
    },
  };
}
