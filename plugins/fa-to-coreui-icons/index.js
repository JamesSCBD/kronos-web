import Vue from 'vue'
import applyMixin from './mixin'

Vue.use((v) => { applyMixin(v) })
