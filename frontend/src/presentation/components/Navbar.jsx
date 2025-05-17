import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importa Link para navegação interna e useNavigate para navegação programática
import { AuthContext } from '../../context/AuthContext'; // Importa o contexto de autenticação
import styles from '../../styles/Navbar.module.css'; // Importa os estilos CSS do componente

/**
 * Componente Navbar:
 *
 * Este componente representa a barra de navegação principal da aplicação.
 * Ele exibe links para diferentes seções da aplicação e lida com a lógica de autenticação (login/logout).
 */
const Navbar = ({ onChangeView }) => {
  const { user, logout } = useContext(AuthContext); // Obtém o usuário e a função de logout do contexto de autenticação
  const navigate = useNavigate(); // Obtém a função navigate para navegação

  // Função para lidar com o logout do usuário
  const handleLogout = () => {
    logout(); // Chama a função de logout do contexto
    navigate('/'); // Redireciona o usuário para a página inicial
    // Opcional: também resetar view para 'home' se quiser
    if (onChangeView) onChangeView('home');
  };

  return (
    <nav className={styles.navbar}>
      {/* Logo da aplicação, redireciona para a página inicial */}
      <div className={styles.logo}><Link to="/">App</Link></div>
      {/* Lista de links de navegação */}
      <ul className={styles.navLinks}>
        {/* Link para a página inicial */}
        <li>
          {/* Para trocar a view sem mudar rota */}
          <button onClick={() => onChangeView && onChangeView('home')} className={styles.authButton}>
            Início
          </button>
        </li>
        {/* Link para a página de poemas */}
        <li><Link to="/poems">Poemas</Link></li>
        {/* Link para o painel do usuário, visível apenas para usuários autenticados com role 'USER' */}
        {user?.token && user?.role === 'USER' && (
          <li><Link to="/user/dashboard">Meu Painel</Link></li>
        )}
        {/* Link para o painel do administrador, visível apenas para usuários autenticados com role 'ADMIN' */}
        {user?.token && user?.role === 'ADMIN' && (
          <li><Link to="/admin/dashboard">Painel Admin</Link></li>
        )}
        {/* Botão de login/logout */}
        <li>
          {user?.token ? (
            // Se o usuário estiver autenticado, exibe o botão de logout
            <button onClick={handleLogout} className={styles.authButton}>Logout</button>
          ) : (
            // Se o usuário não estiver autenticado, exibe o botão de login
            // Aqui troca a view para login ao invés de navegar
            <button onClick={() => onChangeView && onChangeView('login')} className={styles.authButton}>
              Login
            </button>
          )}
        </li>
        {/* Botão de registro, visível apenas para usuários não autenticados */}
        <li>
          {/* botão para registro também */}
          {!user?.token && (
            <button onClick={() => onChangeView && onChangeView('register')} className={styles.authButton}>
              Registrar
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
