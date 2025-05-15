import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';

// Obtém uma referência ao nó DOM onde a aplicação React será montada.
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderiza a aplicação React dentro do nó DOM raiz.
root.render(
  // React.StrictMode é uma ferramenta para destacar problemas potenciais na sua aplicação durante o desenvolvimento.
  // Ajuda a detetar erros comuns nos seus componentes mais cedo.
  <React.StrictMode>
    {/*
      AuthProvider é um componente que disponibiliza o contexto de autenticação para a aplicação.
      Qualquer componente dentro de AuthProvider pode aceder aos dados e funções de autenticação,
      como o utilizador autenticado e funções de login/logout.
    */}
    <AuthProvider>
      {/*
        App é o componente principal da aplicação, contendo a lógica e a interface do utilizador.
        Geralmente, é aqui que a estrutura da aplicação, a navegação e o roteamento são definidos.
      */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
