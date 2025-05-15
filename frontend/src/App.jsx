import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import LoginForm from './presentation/components/LoginForm';
import RegisterForm from './presentation/components/RegisterForm';
import DashboardUser from './presentation/pages/DashboardUser';
import DashboardAdmin from './presentation/pages/DashboardAdmin';

/**
 * App Component:
 *
 * Este é o componente principal da aplicação, que configura o roteamento e a autenticação.
 * Ele usa o React Router para definir as diferentes páginas e guardas de navegação.
 */
export default function App() {
  // Obtém informações do usuário do contexto de autenticação.
  const { user } = useContext(AuthContext);
  const token = user?.token; // Obtém o token de autenticação.
  const role = user?.role;   // Obtém o papel do usuário.

  // O componente BrowserRouter habilita o uso dos recursos de roteamento do React Router.
  return (
    <BrowserRouter>
      {/* Define as rotas para a aplicação. */}
      <Routes>
        {/* Rotas públicas (acessíveis sem autenticação). */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* Rotas protegidas (acessíveis apenas com autenticação). */}
        <Route
          path="/admin/dashboard"
          element={
            // Só permite acesso se o usuário tiver um token e o papel for 'ADMIN'.
            token && role === 'ADMIN' ? (
              <DashboardAdmin />
            ) : (
              // Caso contrário, redireciona para a página de login. A prop 'replace'
              // substitui a entrada atual no histórico, para que o usuário não possa
              // voltar para a página protegida pressionando o botão de voltar.
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/user/dashboard"
          element={
            // Só permite acesso se o usuário tiver um token e o papel for 'USER'.
            token && role === 'USER' ? (
              <DashboardUser />
            ) : (
              // Caso contrário, redireciona para a página de login.
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Rotas de redirecionamento. */}
        <Route
          path="/"
          element={
            // Se o usuário estiver autenticado (tiver um token), redireciona para
            // o painel com base em seu papel. Se não, redireciona para o login.
            token ? (
              <Navigate to={`/${role.toLowerCase()}/dashboard`} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        {/* Rota curinga: se o usuário tentar acessar uma página inexistente,
            redireciona para a página inicial ("/"). */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
