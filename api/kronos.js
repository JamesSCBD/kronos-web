import ky from 'ky';

export default class {
  constructor(tokenReader) {
    this.http = ky.create({
      prefixUrl: process.env.NUXT_ENV_KRONOS_API,
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

    return data;
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

    return data;
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
    const data = await this.http.delete(`api/v2018/organizations/${encodeURIComponent(organizationId)}`);

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
      records    : data,
      recordCount: data.length,
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
