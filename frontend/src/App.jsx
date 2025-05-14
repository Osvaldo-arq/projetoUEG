import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LoginForm from './presentation/components/LoginForm';       
import RegisterForm from './presentation/components/RegisterForm';     
import DashboardUser from './presentation/pages/DashboardUser';     
import DashboardAdmin from './presentation/pages/DashboardAdmin';   

/**
 * Componente principal da aplicação.
 * Configura as rotas da aplicação usando React Router para navegação entre as páginas de login,
 * registro e dashboards de usuário e administrador.  A navegação é protegida com base na presença
 * do token de autenticação e no role do usuário armazenados no localStorage.
 */
export default function App() {
  // Recupera o token de autenticação e o role do usuário do localStorage.
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // Configura as rotas da aplicação usando BrowserRouter e Routes.
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota para a página de login. */}
        <Route path="/login" element={<LoginForm />} />

        {/* Rota para a página de registro. */}
        <Route path="/register" element={<RegisterForm />} />

        {/* Rota para o dashboard.  Acesso condicional com base no token e role. */}
        <Route
          path="/dashboard"
          element={
            token // Se o token existir, o usuário está autenticado.
              ? role === 'ADMIN' // Se o role for 'ADMIN', renderiza o DashboardAdmin.
                ? <DashboardAdmin />
                : <DashboardUser /> // Caso contrário, renderiza o DashboardUser.
              : <Navigate to="/login" replace /> // Se não houver token, redireciona para a página de login.
          }
        />

        {/* Rota para a raiz da aplicação.  Redireciona para /login ou /dashboard conforme o token. */}
        <Route
          path="/"
          element={
            token
              ? <Navigate to="/dashboard" replace /> // Se o usuário estiver autenticado, redireciona para o dashboard.
              : <Navigate to="/login" replace />     // Caso contrário, redireciona para o login.
          }
        />

        {/* Rota para qualquer caminho não definido nas rotas anteriores.  Redireciona para a raiz. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
