import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; // Importa componentes do React Router
import { AuthContext } from './context/AuthContext'; // Importa o contexto de autenticação
import LoginForm from './presentation/components/LoginForm';       // Importa o componente LoginForm
import RegisterForm from './presentation/components/RegisterForm';     // Importa o componente RegisterForm
import DashboardUser from './presentation/pages/DashboardUser';     // Importa o componente DashboardUser
import DashboardAdmin from './presentation/pages/DashboardAdmin';   // Importa o componente DashboardAdmin
import HomePage from './presentation/pages/HomePage';           // Importa o componente HomePage
import PoemsByDate from './presentation/components/PoemsByDate';
import PoemDetail from './presentation/components/PoemDetail';
import LikedPoemsPage from './presentation/components/LikedPoemsPage';   // Importa a página de poemas curtidos

/**
 * Componente App:
 *
 * Este é o componente principal da aplicação React. Ele configura o roteamento da aplicação
 * usando o BrowserRouter e define as rotas para diferentes páginas e componentes.
 */
export default function App() {
  const { user } = useContext(AuthContext); // Obtém o objeto 'user' do contexto de autenticação
  const token = user?.token; // Obtém o token do usuário (se existir)
  const role = user?.role;   // Obtém a role do usuário (se existir)

  return (
    <BrowserRouter>
      <Routes>
        {/* Página pública inicial, acessível a todos */}
        <Route path="/" element={<HomePage />} />
        {/* Página de lista de poemas ordenados por data, acessível a todos */}
        <Route path="/poems-by-date" element={<PoemsByDate />} />
        {/* Página de detalhes de um poema, acessível a todos */}
        <Route path="/poems/:id" element={<PoemDetail />} />
        {/* Página de poemas curtidos pelo usuário, protegida */}
      <Route
        path="/liked-poems"
        element={
          token ? <LikedPoemsPage /> : <Navigate to="/login" replace />
        }
      />

        {/* Rotas de autenticação, acessíveis a usuários não autenticados */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* Dashboards protegidos, acessíveis apenas a usuários autenticados com a role correta */}
        <Route
          path="/admin/dashboard"
          element={
            // Se o usuário estiver autenticado e for um administrador, renderiza o DashboardAdmin
            token && role === 'ADMIN' ? (
              <DashboardAdmin />
            ) : (
              // Caso contrário, redireciona para a página de login
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/user/dashboard"
          element={
            // Se o usuário estiver autenticado e for um usuário comum, renderiza o DashboardUser
            token && role === 'USER' ? (
              <DashboardUser />
            ) : (
              // Caso contrário, redireciona para a página de login
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Rota curinga para lidar com URLs não encontradas, redireciona para a página inicial */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
