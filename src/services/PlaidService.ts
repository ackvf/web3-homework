import CoreAPIService from './CoreAPIService'

const url = 'plaid'

class PlaidService {
  // CREATE

  createLinkToken = async () => CoreAPIService.post<{ link_token: string }>(`${url}/create-link-token`)

  // READ

  exchangePublicToken = async (publicToken: string) =>
    CoreAPIService.post<{ link_token: string }>(`${url}/exchange-public-token`, { public_token: publicToken })
}

export default new PlaidService() // eslint-disable-line import/no-anonymous-default-export
