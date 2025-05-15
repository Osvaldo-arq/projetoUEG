const HttpClient = {
  /**
   * Envia uma requisição HTTP POST para a URL especificada.
   *
   * @param {string} url - A URL para enviar a requisição.
   * @param {any} body - O corpo da requisição (será serializado para JSON).
   * @param {string} [token] - Token de autenticação opcional.
   * @returns {Promise<Response>} O objeto Response do fetch.
   * @throws {Error} Se o status da resposta não for OK (200-299).
   */
  post: async (url, body, token) => {
    // Registra a requisição de saída com o token truncado por segurança.
    console.log(`HttpClient→ POST ${url}`, body, token ? '[token]' : '');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    console.log(`HttpClient← Status ${res.status}`);
    if (!res.ok) {
      const errText = await res.text();
      console.error('HttpClient ERROR:', errText);
      throw new Error(errText);
    }
    return res;
  },

  /**
   * Envia uma requisição HTTP GET para a URL especificada.
   *
   * @param {string} url - A URL para enviar a requisição.
   * @param {string} [token] - Token de autenticação opcional.
   * @returns {Promise<any>} A resposta do servidor em JSON.
   * @throws {Error} Se o status da resposta não for OK (200-299).
   */
  get: async (url, token) => {
    // Registra a requisição de saída com o token truncado por segurança.
    console.log(`HttpClient→ GET ${url}`, token ? '[token]' : '');
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(url, { headers });
    console.log(`HttpClient← Status ${res.status}`);
    if (!res.ok) {
      const errText = await res.text();
      console.error('HttpClient ERROR:', errText);
      throw new Error(errText);
    }
    return res.json();
  },

  /**
   * Envia uma requisição HTTP DELETE para a URL especificada.
   *
   * @param {string} url - A URL para enviar a requisição.
   * @param {string} [token] - Token de autenticação opcional.
   * @returns {Promise<Response>} O objeto Response do fetch.
   * @throws {Error} Se o status da resposta não for OK (e não for 204 No Content).
   */
  delete: async (url, token) => {
    // Registra a requisição de saída com o token truncado por segurança.
    console.log(`HttpClient→ DELETE ${url}`, token ? '[token]' : '');
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(url, {
      method: 'DELETE',
      headers,
    });
    console.log(`HttpClient← Status ${res.status}`);
    if (!res.ok && res.status !== 204) {
      const errText = await res.text();
      console.error('HttpClient ERROR:', errText);
      throw new Error(errText);
    }
    return res;
  },

  /**
   * Envia uma requisição HTTP PUT para a URL especificada.
   *
   * @param {string} url - A URL para enviar a requisição.
   * @param {any} body - O corpo da requisição (será serializado para JSON).
   * @param {string} [token] - Token de autenticação opcional.
   * @returns {Promise<Response>} O objeto Response do fetch.
   * @throws {Error} Se o status da resposta não for OK (200-299).
   */
  put: async (url, body, token) => {
    // Registra a requisição de saída com o token truncado por segurança.
    console.log(`HttpClient→ PUT ${url}`, body, token ? '[token]' : '');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });
    console.log(`HttpClient← Status ${res.status}`);
    if (!res.ok) {
      const errText = await res.text();
      console.error('HttpClient ERROR:', errText);
      throw new Error(errText);
    }
    return res;
  },
};

export default HttpClient;