<template>
  <div class="container-fluid">
    <div class="row ">
      <div class="col-12">
        <ConferenceList />
      </div>
    </div>
  </div>
</template>

<script>
import { readOnly } from '@roles';
import ConferenceList from '~/components/list/ConferencesList';

export default {
  name      : 'Conferences',
  components: { ConferenceList },
  auth      : readOnly,
};

</script>
