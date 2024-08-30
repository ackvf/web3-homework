const API = 'api'

const headers = () => ({
  'Content-Type': 'application/json',
})

const responseData = async <T extends Response>(response: T) => response.json()

const handleError = (error: Error) => {
  console.error('[CoreApiService] Error', error)
  throw error
}

class CoreAPIService {
  get = async <R>(url: string, params: AnyObject = {}) =>
    fetch(`${API}/${url}?${new URLSearchParams(params).toString()}`, {
      method: 'GET',
      headers: headers(),
    })
      .then<R>(responseData)
      .catch(handleError)

  post = async <R>(url: string, data: AnyObject = {}, { headers: headers_, ...config }: RequestInit = {}) =>
    fetch(`${API}/${url}`, {
      method: 'POST',
      headers: { ...headers(), ...headers_ },
      body: JSON.stringify(data),
      ...config,
    })
      .then<R>(responseData)
      .catch(handleError)

  put = async <R>(url: string, data: AnyObject) =>
    fetch(`${API}/${url}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(data),
    })
      .then<R>(responseData)
      .catch(handleError)

  patch = async <R>(url: string, data: AnyObject = {}) =>
    fetch(`${API}/${url}`, {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify(data),
    })
      .then<R>(responseData)
      .catch(handleError)

  delete = async <R>(url: string, data: AnyObject = {}) =>
    fetch(`${API}/${url}`, {
      method: 'DELETE',
      headers: headers(),
      body: JSON.stringify(data),
    })
      .then<R>(responseData)
      .catch(handleError)
}

export default new CoreAPIService() // eslint-disable-line import/no-anonymous-default-export
