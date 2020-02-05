
import ky from 'ky'

export default class {
  constructor (tokenReader){
    this.http = ky.create({
      prefixUrl: process.env.NUXT_ENV_KRONOS_API,
      hooks    : {
        beforeRequest: [
          (request) => {
            request.headers.set('Authorization', `Token ${tokenReader()}`)
          }
        ]
      }
    })
  }

  async getCountries (){
    const data = await this.http.get('api/v2018/countries').json()
 
    return data
  }

  async queryContact (query){
    const queryStringParams = { q: JSON.stringify(query) }

    const data = await this.http.get('api/v2018/contacts', { searchParams: new URLSearchParams(queryStringParams) }).json()

    return data
  }

  async queryOrganizations (query){
    const queryStringParams = { q: JSON.stringify(query) }

    const data = await this.http.get('api/v2018/organizations', { searchParams: new URLSearchParams(queryStringParams) }).json()

    return data
  }
}
