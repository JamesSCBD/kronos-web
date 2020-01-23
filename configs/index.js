import path        from 'path'
import dotenv      from 'dotenv'
import fontawesome from './fa'
import purgeCSS    from './purgeCSS'
import roles       from './roles'
import ssoScbd     from './ssoScbd'

const dotEnvReader = () => dotenv.config({ path: path.resolve(process.cwd(), '.env') })

export { fontawesome, purgeCSS, dotEnvReader, roles, ssoScbd }
