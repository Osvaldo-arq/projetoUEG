import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LoginForm from './presentation/components/LoginForm';
import RegisterForm from './presentation/components/RegisterForm';
import DashboardUser from './presentation/pages/DashboardUser';
import DashboardAdmin from './presentation/pages/DashboardAdmin';

/**
 * Componente principal da aplicação, responsável pela configuração das rotas.
 * Utiliza React Router para definir a navegação entre as diferentes páginas.
 */
export default function App() {
  // Recupera o token e a role do usuário do armazenamento local.
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        <Route
          path="/dashboard"
          element={
            // Se o usuário estiver autenticado (token existir), renderiza o dashboard apropriado
            token
              ? (role === 'ADMIN'
                ? <DashboardAdmin /> // Se o usuário for um administrador
                : <DashboardUser />) // Se o usuário for um usuário normal
              : <Navigate to="/login" replace /> // Se não estiver autenticado, redireciona para a página de login
          }
        />

        {/* Rota para qualquer outra URL não definida explicitamente */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
