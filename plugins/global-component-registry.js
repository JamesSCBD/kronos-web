import Vue from 'vue'
import { CBadge, CEmitRootEvent, CIcon } from '@coreui/vue'

const components = [ CBadge, CIcon ]
const directives = [ CEmitRootEvent ]

export default () => {
  for (const component of components)
    Vue.component(component.name, component)
    
  for (const directive of directives)
    Vue.directive(directive.name, directive)
}
