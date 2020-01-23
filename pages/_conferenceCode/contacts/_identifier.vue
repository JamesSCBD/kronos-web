<template>
  <div class="container-fluid">
    <div class="row ">
      <div class="col-12">
        Edit:
        <pre>
          {{ doc }}
        </pre>
      </div>
    </div>
  </div>
</template>

<script>
import { user } from '@roles'

const apiHost = process.env.NUXT_ENV_KRONOS_API

export default {
  name   : 'EditContact',
  data,
  mounted,
  methods: { loadDoc },
  auth   : user
}

async function mounted (){
  this.doc = await this.loadDoc()
}
function data (){
  const { identifier } = this.$route.params
  const doc            = {}

  return { identifier, doc }
}

function loadDoc (){
  return this.$http.$get(`${apiHost}/api/v2018/contacts/${this.identifier}`)
    .then(d => d)
}
</script>
