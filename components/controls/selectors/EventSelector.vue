<template>
  <div>
    <multiselect
      v-model="selectedEvents"
      label="code"
      track-by="eventId"
      placeholder="Meetings"
      open-direction="bottom"
      :options="eventOptions"
      group-values="events"
      group-label="title"
      :group-select="false"
      :multiple="multiple"
      :clear-on-select="false"
      :close-on-select="!multiple"
      :show-no-results="false"
      :searchable="true"
    >
      <template slot="selection" slot-scope="{ values }">
        <span
          v-if="values.length > 2"
          class="multiselect__single"
        >{{ values.length }} meetings selected</span>
      </template>
      <template slot="clear">
        <div
          v-if="selectedEvents.length"
          class="multiselect__clear"
          @mousedown.prevent.stop="selectedEvents = null"
        />
      </template>
    </multiselect>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import _ from 'lodash';
import Multiselect from 'vue-multiselect';
import SelectorsMixin  from './SelectorsMixin';

export default {
  name      : 'EventSelector',
  components: { Multiselect },
  mixins    : [ SelectorsMixin ],
  props     : {
    value: {
      type    : [ String, Array ],
      required: true,
      default() {
        return [];
      },
    },
  },
  computed: {
    selectedEvents: {
      get() {
        return this.asArray(this.value).map((value) => this.events.find((option) => option.eventId === value) || { eventId: value, isMissing: true });
      },
      set(events) {
        const ids = this.asArray(events).map((event) => event.eventId);
        this.$emit('input', this.multiple ? ids : ids[0]);
      },
    },
    eventOptions: getEventOptions,
    ...mapGetters({
      events: 'conferences/events',
    }),
  },
};

function getEventOptions() {
  const now = new Date();

  const options = [{
    title : 'Main meetings',
    events: _(this.events)
      .filter((e) => e.isMajor)
      .orderBy([ 'startDate', 'endDate', 'code' ], [ 'asc', 'desc', 'asc' ])
      .value(),
  }, {
    title : 'Parallel meetings',
    events: _(this.events)
      .filter((e) => e.isMinor)
      .orderBy([ 'startDate', 'endDate', 'code' ], [ 'asc', 'desc', 'asc' ])
      .value(),
  }, {
    title : 'Future meetings',
    events: _(this.events)
      .filter((e) => !e.isMajor && !e.isMinor && new Date(e.endDate) > now)
      .orderBy([ 'startDate', 'endDate', 'code' ], [ 'asc', 'desc', 'asc' ])
      .value(),
  }, {
    title : 'Recent past meetings',
    events: _(this.events)
      .filter((e) => !e.isMajor && !e.isMinor && new Date(e.endDate) <= now)
      .orderBy([ 'startDate', 'endDate', 'code' ], [ 'desc', 'asc', 'asc' ])
      .value(),
  }];

  return _.filter(options, (o) => o.events.length);
}
</script>
