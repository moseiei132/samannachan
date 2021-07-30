import { User } from '../entity/user.entity'

export class CheckTokenData {
  status?: boolean
  message?: string
  data?: User
}
