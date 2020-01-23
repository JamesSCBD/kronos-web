import { user } from '@roles'

const apiHost = process.env.NUXT_ENV_KRONOS_API

export default {
  data,
  mounted,
  methods: { loadDoc },
  auth   : user
}

async function mounted (){ this.doc = await this.loadDoc() }

function data (){
  const { identifier } = this.$route.params
  const doc            = {}

  return { identifier, doc }
}

function loadDoc (){
  return this.$http.$get(`${apiHost}/api/v2018/${this.schema}/${this.identifier}`)
    .then(d => d)
}
