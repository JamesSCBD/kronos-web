<template>
  <div class="container-fluid">
    <div class="row ">
      <div class="col-12">
        <List type="contacts" :table-fields="tableFields" />
      </div>
    </div>
  </div>
</template>

<script>
import { user       } from '@roles'
import { List       } from '@components'

export default {
  name      : 'Contacts',
  components: { List },
  auth      : user

}

</script>
