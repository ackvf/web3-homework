import CoreAPIService from './CoreAPIService'
import type { RedisUser, UserFormPayload } from './redis'

const urlSegment = 'user'

class UserAPIService {
  // CREATE

  createNewUser = async (params: UserFormPayload) =>
    CoreAPIService.post<{ status: 'fulfilled'; value: number }>(`${urlSegment}/new`, params)

  // READ

  exists = async (params: Pick<UserFormPayload, 'email'> | UserFormPayload['email']) =>
    CoreAPIService.post<boolean>(`${urlSegment}/exists`, { email: (params as UserFormPayload).email || params })

  get = async (params: Pick<UserFormPayload, 'email'> | UserFormPayload['email']) =>
    CoreAPIService.post<RedisUser>(`${urlSegment}/get`, { email: (params as UserFormPayload).email || params })

  // DELETE

  delete = async (params: Pick<UserFormPayload, 'email'> | UserFormPayload['email']) =>
    CoreAPIService.post<any>(`${urlSegment}/get`, { email: (params as UserFormPayload).email || params })
}

export default new UserAPIService() // eslint-disable-line import/no-anonymous-default-export
