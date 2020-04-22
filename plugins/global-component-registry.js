import Vue from 'vue';
import { CBadge, CEmitRootEvent, CIcon } from '@coreui/vue';

const globalComponents = [ CBadge, CIcon ];
const globalDirectives = [ CEmitRootEvent ];

globalComponents.forEach((component) => Vue.component(component.name, component));
globalDirectives.forEach((directive) => Vue.directive(directive.name, directive));

export default () => {};
