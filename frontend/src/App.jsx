import React, { useContext } from 'react'; // Importa React e useContext.
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; // Importa componentes do React Router.
import { AuthContext } from './context/AuthContext'; // Importa o contexto de autenticação.

import HomePage from './presentation/pages/HomePage'; // Importa a página inicial.
import PoemsByDate from './presentation/components/PoemsByDate'; // Importa o componente de poemas por data.
import PoemDetail from './presentation/components/PoemDetail'; // Importa o componente de detalhes do poema.
import LikedPoemsPage from './presentation/components/LikedPoemsPage'; // Importa a página de poemas curtidos.
import LoginForm from './presentation/components/LoginForm'; // Importa o formulário de login.
import RegisterForm from './presentation/components/RegisterForm'; // Importa o formulário de registro.
import DashboardUser from './presentation/pages/DashboardUser'; // Importa o dashboard do usuário.
import DashboardAdmin from './presentation/pages/DashboardAdmin'; // Importa o dashboard do administrador.

/**
 * Componente principal da aplicação.
 * Define as rotas da aplicação e gerencia a navegação.
 * @param {Object} props - Propriedades do componente.
 */
export default function App() {
  const { user } = useContext(AuthContext); // Obtém o usuário do contexto de autenticação.
  const token = user?.token; // Obtém o token do usuário, se existir.
  const role = user?.role; // Obtém a role do usuário, se existir.

  // Renderiza a estrutura de roteamento da aplicação.
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas (acessíveis a todos). */}
        <Route path="/" element={<HomePage />} /> {/* Rota para a página inicial. */}
        <Route path="/poems-by-date" element={<PoemsByDate />} /> {/* Rota para a página de poemas por data. */}
        <Route path="/poems/:id" element={<PoemDetail />} /> {/* Rota para a página de detalhes do poema. */}

        {/* Rota protegida: Poemas curtidos (requer autenticação). */}
        <Route
          path="/liked-poems"
          element={token ? <LikedPoemsPage /> : <Navigate to="/login" replace />}
          // Se o usuário estiver autenticado (token existir), renderiza LikedPoemsPage;
          // caso contrário, redireciona para a página de login.
        />

        {/* Rotas de autenticação. */}
        <Route path="/login" element={<LoginForm />} /> {/* Rota para o formulário de login. */}
        <Route path="/register" element={<RegisterForm />} /> {/* Rota para o formulário de registro. */}

        {/* Rotas dos dashboards (protegidas por autenticação e role). */}
        <Route
          path="/admin/dashboard"
          element={
            token && role === 'ADMIN'
              ? <DashboardAdmin />
              : <Navigate to="/login" replace />
          }
          // Acessível apenas a usuários autenticados com a role 'ADMIN'.
        />
        <Route
          path="/user/dashboard"
          element={
            token && role === 'USER'
              ? <DashboardUser />
              : <Navigate to="/login" replace />
          }
          // Acessível apenas a usuários autenticados com a role 'USER'.
        />

        {/* Rota catch-all: Redireciona para a página inicial para qualquer rota não correspondente. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

