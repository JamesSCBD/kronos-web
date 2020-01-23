import { BTable              } from 'bootstrap-vue'
import { CIcon } from '@coreui/vue'
import { CountryCol, MetaCol, ActionsCol } from './Columns'
import { actions             } from '~/configs/table-fields'

const components = {  BTable, MetaCol, ActionsCol, CountryCol, CIcon }
const methods = { addActionRow }

const props =  {
  type      : { type: String, default: 'default' },
  tableItems: { type: [ Function, Array ], required: true },
  loading   : { type: Boolean, required: true }
}

function mounted (){
  this.addActionRow()
}

export default { components, props, methods, mounted }

function addActionRow (){
  const isReadOnlyUser = this.$me.hasRole('Kronos-ReadOnly')

  if (!isReadOnlyUser) this.tableFields = [ ...this.tableFields, actions ]
}
