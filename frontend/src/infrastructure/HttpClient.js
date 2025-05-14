const HttpClient = {
  /**
   * Realiza uma requisição HTTP POST para a URL especificada.
   *
   * @param {string} url - A URL para a qual a requisição POST será enviada.
   * @param {any} body - O corpo da requisição, que será convertido para JSON.
   * @param {string} [token] - O token de autenticação a ser incluído no cabeçalho 'Authorization' (opcional).
   * @returns {Promise<Response>} Uma Promise que resolve com a resposta do servidor.
   * @throws {Error} Se a resposta do servidor não for bem-sucedida (status fora do intervalo 200-299).
   */
  post: async (url, body, token) => {
    // Imprime informações sobre a requisição POST no console para fins de depuração.
    console.log(`HttpClient→ POST ${url}`, body, token ? `(token: ${token})` : '');
    // Define os cabeçalhos da requisição.  O 'Content-Type' é sempre definido como 'application/json'.
    const headers = { 'Content-Type': 'application/json' };
    // Se um token for fornecido, adiciona o cabeçalho 'Authorization' com o token Bearer.
    if (token) headers['Authorization'] = `Bearer ${token}`;

    // Realiza a requisição POST usando a função fetch.
    const res = await fetch(url, {
      method: 'POST', // Especifica o método HTTP como POST.
      headers: headers, // Inclui os cabeçalhos definidos.
      body: JSON.stringify(body), // Converte o corpo da requisição para JSON e o envia.
    });
    // Imprime o status da resposta do servidor no console.
    console.log(`HttpClient← Status ${res.status} ${res.statusText}`);
    // Verifica se a resposta foi bem-sucedida (status 200-299).
    if (!res.ok) {
      // Se a resposta não for bem-sucedida, obtém o texto do corpo da resposta.
      const text = await res.text();
      // Imprime o corpo da resposta de erro no console para diagnóstico.
      console.error(`HttpClient ERROR body:`, text);
      // Lança um erro com o texto da resposta para indicar a falha.
      throw new Error(text);
    }
    // Retorna a resposta do servidor.
    return res;
  },

  /**
   * Realiza uma requisição HTTP GET para a URL especificada.
   *
   * @param {string} url - A URL para a qual a requisição GET será enviada.
   * @param {string} [token] - O token de autenticação a ser incluído no cabeçalho 'Authorization' (opcional).
   * @returns {Promise<any>} Uma Promise que resolve com a resposta do servidor,解析ada como JSON.
   * @throws {Error} Se a resposta do servidor não for bem-sucedida (status fora do intervalo 200-299).
   */
  get: async (url, token) => {
    // Imprime informações sobre a requisição GET no console.
    console.log(`HttpClient→ GET ${url}`, token ? `(token: ${token})` : '');
    // Define os cabeçalhos da requisição.
    const headers = {};
    // Se um token for fornecido, adiciona o cabeçalho 'Authorization' com o token Bearer.
    if (token) headers['Authorization'] = `Bearer ${token}`;

    // Realiza a requisição GET usando a função fetch.
    const res = await fetch(url, { headers: headers });
    // Imprime o status da resposta do servidor no console.
    console.log(`HttpClient← Status ${res.status} ${res.statusText}`);
    // Verifica se a resposta foi bem-sucedida (status 200-299).
    if (!res.ok) {
      // Se a resposta não for bem-sucedida, obtém o texto do corpo da resposta.
      const text = await res.text();
      // Imprime o corpo da resposta de erro no console.
      console.error(`HttpClient ERROR body:`, text);
      // Lança um erro com o texto da resposta.
      throw new Error(text);
    }
    // Retorna a resposta do servidor解析ada como JSON.
    return res.json();
  },
};

export default HttpClient;
