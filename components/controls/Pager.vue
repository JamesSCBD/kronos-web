<template>
  <div>
    <div class="paginationRow">
      <span v-if="recordCount === 0">No matching records found</span>
      <span v-if="recordCount != null && recordCount > 0">{{ recordCount }} records / {{ numberOfPages }} pages</span>
      <BFormSelect
        id="page-size"
        v-model="perPage"
        class="form-control"
        :options="pageOptions"
      />
      <BPagination
        v-model="currentPage"
        :total-rows="recordCount"
        :per-page="pageSize"
        prev-text="Prev"
        next-text="Next"
        hide-goto-end-buttons
        limit="4"
      />
    </div>
  </div>
</template>

<script>
import { BFormSelect, BPagination } from 'bootstrap-vue';

const pageOptions = [
  { value: 25, text: '25/page' },
  { value: 50, text: '50/page' },
  { value: 100, text: '100/page' },
  { value: 250, text: '250/page' },
];

const defaultPageSize = pageOptions[0].value;
const defaultPage     = 1;

export default {
  name      : 'ContactsList',
  components: { BFormSelect, BPagination },
  props     : {
    pageSize:
    {
      type    : Number,
      default : 25,
      required: true,
      validator(value) {
        return pageOptions.some((o) => o.value === value);
      },
    },
    page:
    {
      type    : Number,
      required: true,
      default : 1,
      validator(value) {
        return value > 0;
      },
    },
    syncQueryString:
    {
      type    : Boolean,
      required: true,
      default : false,
    },
    recordCount:
    {
      type    : Number,
      required: true,
      default : 0,
      validator(value) {
        return value >= 0;
      },
    },
  },
  data() {
    return {
      pageOptions,
    };
  },
  computed: {
    currentPage: { get() { return this.page; }, set(value) { this.$emit('update:page', value); } },
    perPage    : { get() { return this.pageSize; }, set(value) { this.$emit('update:pageSize', value); } },
    numberOfPages() { return Math.ceil(this.recordCount / this.pageSize); },
  },
  watch: {
    page() {
      if (this.syncQueryString) this.saveQueryString();
    },
    pageSize() {
      if (this.syncQueryString) this.saveQueryString();
    },
  },
  mounted,
  methods: { loadQueryString, saveQueryString },
};

function mounted() {
  if (this.syncQueryString) this.loadQueryString();
}

function loadQueryString() {
  const page     = parseInt(this.$route.query.page, 10);
  const pageSize = parseInt(this.$route.query.pageSize, 10);

  this.currentPage = page >= 1 ? page : defaultPage;
  this.perPage     = pageOptions.some((o) => o.value === pageSize) ? pageSize : defaultPageSize;
}

function saveQueryString() {
  const params = {
    page    : undefined,
    pageSize: undefined,
  };

  if (this.page && this.page !== defaultPage) params.page = this.page;
  if (this.pageSize && this.pageSize !== defaultPageSize) params.pageSize = this.pageSize;

  const newQueryString = { ...this.$route.query, ...params };

  this.$router.push({ query: newQueryString });
}
</script>
