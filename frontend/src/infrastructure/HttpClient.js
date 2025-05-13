export default {
  /**
   * Função para realizar uma requisição HTTP POST.
   * @param url A URL para a qual a requisição será enviada.
   * @param body O corpo da requisição, que será enviado como JSON.
   * @param token O token de autenticação (opcional) a ser incluído no cabeçalho da requisição.
   * @returns Uma Promise que resolve com a resposta do servidor.
   * @throws Um erro se a resposta do servidor não for bem-sucedida (status não for 200-299).
   */
  post: async (url, body, token) => {
    // Define os cabeçalhos padrão para a requisição POST.
    const headers = { 'Content-Type': 'application/json' };
    // Se um token de autenticação for fornecido, adiciona o cabeçalho de Autorização.
    if (token) headers['Authorization'] = `Bearer ${token}`;

    // Realiza a requisição POST usando a função fetch.
    const res = await fetch(url, {
      method: 'POST', // Especifica o método HTTP como POST.
      headers,       // Inclui os cabeçalhos definidos.
      body: JSON.stringify(body), // Converte o corpo da requisição para JSON e o inclui.
    });
    // Verifica se a resposta do servidor foi bem-sucedida (status 200-299).
    if (!res.ok) throw new Error(await res.text()); // Se não, lança um erro com o texto da resposta.
    return res; // Retorna a resposta do servidor.
  },

  /**
   * Função para realizar uma requisição HTTP GET.
   * @param url A URL para a qual a requisição será enviada.
   * @param token O token de autenticação (opcional) a ser incluído no cabeçalho da requisição.
   * @returns Uma Promise que resolve com a resposta do servidor em formato JSON.
   * @throws Um erro se a resposta do servidor não for bem-sucedida (status não for 200-299).
   */
  get: async (url, token) => {
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // Adicione put, delete, etc., conforme necessário
};
