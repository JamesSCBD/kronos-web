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
import mixin from '~/modules/edit-doc-mixin'

export default {
  name  : 'EditOrganization',
  mixins: [ mixin ],
  data  : () => ({ schema: 'organizations' })
}

</script>
