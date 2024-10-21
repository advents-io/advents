import 'dayjs/locale/pt-br'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.locale('pt-br')
dayjs.extend(utc)

export { dayjs }
