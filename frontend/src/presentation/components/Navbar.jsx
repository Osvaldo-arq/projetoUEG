import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import styles from '../../styles/Navbar.module.css';

/**
 * Componente Navbar:
 *
 * Esta barra de navegação exibe:
 * - Logo que leva à HomePage (interna)
 * - Botões que trocam de “view” na HomePage: Início, Login, Registrar, Poemas, Recentes
 * - Links para dashboards protegidos (USER / ADMIN)
 * - Botão de Login/Logout conforme autenticação
 */
export default function Navbar({ onChangeView }) {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    if (onChangeView) onChangeView('home');
  };

  return (
    <nav className={styles.navbar}>
      {/* Logo leva à HomePage interna */}
      <div
        className={styles.logo}
        onClick={() => onChangeView && onChangeView('home')}
        style={{ cursor: 'pointer' }}
      >
        PoemApp
      </div>

      <ul className={styles.navLinks}>
        {/* Início */}
        <li>
          <button
            onClick={() => onChangeView && onChangeView('home')}
            className={styles.authButton}
          >
            Início
          </button>
        </li>

        {/* Poemas - Mesmos component de Recentes */}
        <li>
          <button
            onClick={() => onChangeView && onChangeView('poems-by-date')}
            className={styles.authButton}
          >
            Poemas
          </button>
        </li>
        {(user?.token && (user.role === 'USER' || user.role === 'ADMIN')) && (
          <li>
            <button
              onClick={() => onChangeView && onChangeView('liked-poems')}
              className={styles.authButton}
          >
            Curtidas
          </button>
        </li>
        )}

        {/* Dashboards protegidos */}
        {user?.token && user.role === 'USER' && (
          <li>
            <Link to="/user/dashboard" className={styles.navButton}>
              Meu Painel
            </Link>
          </li>
        )}
        {user?.token && user.role === 'ADMIN' && (
          <li>
            <Link to="/admin/dashboard" className={styles.navButton}>
              Painel Admin
            </Link>
          </li>
        )}

        {/* Autenticação */}
        <li>
          {user?.token ? (
            <button
              onClick={handleLogout}
              className={styles.authButton}
            >
              Logout
            </button>
          ) : (
            <>
              <button
                onClick={() => onChangeView && onChangeView('login')}
                className={styles.authButton}
              >
                Login
              </button>
              <button
                onClick={() => onChangeView && onChangeView('register')}
                className={styles.authButton}
              >
                Registrar
              </button>
            </>
          )}
        </li>
      </ul>
    </nav>
  );
}
