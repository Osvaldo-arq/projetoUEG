import React, { createContext, useState, useEffect } from 'react';

// Cria um novo contexto para autenticação.
// O contexto contém um objeto com as propriedades:
// - user: o usuário autenticado (ou null se não estiver autenticado)
// - login: uma função para realizar o login do usuário
// - logout: uma função para realizar o logout do usuário
export const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
});

// Componente provedor do contexto de autenticação.
// Este componente envolve a árvore de componentes da aplicação e fornece
// o contexto de autenticação para todos os componentes filhos.
export const AuthProvider = ({ children }) => {
  // Estado para armazenar o usuário autenticado.
  // Inicialmente é null, e será atualizado após o login.
  const [user, setUser] = useState(null);

  // Efeito para carregar o usuário do localStorage na inicialização.
  // Este efeito é executado apenas uma vez, quando o componente é montado.
  useEffect(() => {
    // Tenta obter o token e o role do usuário do localStorage.
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    // Se ambos existirem, significa que o usuário já estava autenticado.
    if (token && role) {
      // Atualiza o estado 'user' com as informações do usuário.
      setUser({ token, role });
    }
  }, []); // Dependência: []. Garante que o efeito rode apenas uma vez.

  // Função para realizar o login do usuário.
  // Esta função é passada para o contexto para que os componentes possam chamá-la.
  const login = (token, role) => {
    // Salva o token e o role do usuário no localStorage.
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    // Atualiza o estado 'user' com as informações do usuário.
    setUser({ token, role });
  };

  // Função para realizar o logout do usuário.
  // Esta função é passada para o contexto para que os componentes possam chamá-la.
  const logout = () => {
    // Remove o token e o role do usuário do localStorage.
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    // Atualiza o estado 'user' para null.
    setUser(null);
  };

  // Retorna o provedor do contexto.
  // O provedor torna os valores 'user', 'login' e 'logout' disponíveis
  // para todos os componentes descendentes.
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {/* Renderiza os componentes filhos. */}
      {children}
    </AuthContext.Provider>
  );
};
