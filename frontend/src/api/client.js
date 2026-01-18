// Axios-like HTTP client for API calls
class APIClient {
  constructor(baseURL) {
    this.baseURL = baseURL || 'http://localhost:5000';
  }

  async request(method, endpoint, data = null, headers = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      const responseData = await response.json();

      if (!response.ok) {
        const error = new Error(responseData.error || 'API Error');
        error.status = response.status;
        error.data = responseData;
        throw error;
      }

      return { data: responseData, status: response.status };
    } catch (error) {
      console.error(`API ${method} ${endpoint} failed:`, error);
      throw error;
    }
  }

  get(endpoint, headers) {
    return this.request('GET', endpoint, null, headers);
  }

  post(endpoint, data, headers) {
    return this.request('POST', endpoint, data, headers);
  }

  put(endpoint, data, headers) {
    return this.request('PUT', endpoint, data, headers);
  }

  delete(endpoint, headers) {
    return this.request('DELETE', endpoint, null, headers);
  }
}

const client = new APIClient(import.meta.env.VITE_API_URL || 'http://localhost:5000');
export default client;
