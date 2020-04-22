import Vue from 'vue';
import { datetime, date, time } from '~/filters/datetime';

Vue.filter('datetime', datetime);
Vue.filter('date', date);
Vue.filter('time', time);
