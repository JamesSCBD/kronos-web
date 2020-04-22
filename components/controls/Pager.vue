<template>
  <div>
    <div class="paginationRow">
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
import _ from 'lodash'
import { BFormSelect, BPagination } from 'bootstrap-vue'

const pageOptions = [
  { value: 25, text: '25/page' },
  { value: 50, text: '50/page' },
  { value: 100, text: '100/page' },
  { value: 250, text: '250/page' }
]

const defaultPageSize = pageOptions[0].value
const defaultPage     = 1

export default {
  name      : 'ContactsList',
  components: { BFormSelect, BPagination },
  props     : {
    pageSize:
    {
      type    : Number,
      default : 25,
      required: true,
      validator (value){
        return pageOptions.some(o => o.value == value)
      }
    },
    page:
    {
      type    : Number,
      required: true,
      default : 1,
      validator (value){
        return value > 0
      }
    },
    syncQueryString:
    {
      type    : Boolean,
      required: true,
      default : false
    },
    recordCount:
    {
      type    : Number,
      required: true,
      default : 0,
      validator (value){
        return value >= 0
      }
    }
  },
  data (){
    return {
      pageOptions
    }
  },
  computed: {
    currentPage: { get (){ return this.page }, set (value){ this.$emit('update:page', value) } },
    perPage    : { get (){ return this.pageSize }, set (value){ this.$emit('update:pageSize', value) } }
  },
  watch: {
    page (){
      if (this.syncQueryString)
        this.saveQueryString()
    },
    pageSize (){
      if (this.syncQueryString)
        this.saveQueryString()
    }
  },
  mounted,
  methods: { loadQueryString, saveQueryString }
}

function mounted (){
  if (this.syncQueryString)
    this.loadQueryString()
}

function loadQueryString (){
  const { page, pageSize } = this.$route.query

  this.currentPage = parseInt(page) >= 1 ? parseInt(page) : defaultPage
  this.perPage     = _.some(pageOptions, [ 'value', parseInt(pageSize) ]) ? parseInt(pageSize) : defaultPageSize
}

function  saveQueryString (){
  const params = {
    pageSize: undefined,
    page    : undefined
  }

  if (this.page     != defaultPage)     params.page     = this.page
  if (this.pageSize != defaultPageSize) params.pageSize = this.pageSize
  const newQueryString = { ...this.$route.query, ...params }

  this.$router.push({ query: newQueryString })
}
</script>
<style scoped>
.paginationRow {
  display: inline-block;
  width: 100%;
  text-align: right;
}

select#page-size {
  display: inline;
  width: auto;
  margin: 0px 5px;
}
ul.pagination.b-pagination {
  width: auto;
  float: right;
}
</style>
