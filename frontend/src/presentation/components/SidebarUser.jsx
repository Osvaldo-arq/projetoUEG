import React from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import styles from '../../styles/Sidebar.module.css';
import { useNavigate } from 'react-router-dom';

/**
 * Sidebar Component:
 * - isMinimized: boolean controlling collapse state
 * - toggleSidebar: function to toggle collapse
 * - setSection: function to switch main content section
 * - handleLogout: function to log out user
 */
export default function Sidebar({
  isMinimized,
  toggleSidebar,
  setSection,
  handleLogout
}) {
  // Define nav items for user dashboard
  const navItems = [
    { key: 'profile', label: 'Meu Perfil', icon: null },
    { key: 'user', label: 'Minha Conta', icon: null }
  ];
  const navigate = useNavigate(); // Hook para navegação programática
  const goHome = () => {
    navigate('/'); // Redireciona para a homepage
  };
  return (
    <aside className={`${styles.sidebar} ${isMinimized ? styles.sidebarMinimized : ''}`}>      
      <div className={styles.header}>
        <h2 className={styles.title}>{isMinimized ? 'Us' : 'Usuário'}</h2>
        <button onClick={toggleSidebar} className={styles.toggleSidebarButton}>          
          {isMinimized ? <FaBars /> : <FaTimes />}
        </button>
      </div>
      {/* Botão para retornar à homepage */}
      <button onClick={goHome} className={styles.logoutButton}>
        Home
      </button>

      <nav className={styles.nav}>
        {navItems.map(item => (
          <button
            key={item.key}
            onClick={() => setSection(item.key)}
            className={styles.navButton}
          >
            {item.label}
          </button>
        ))}
      </nav>

        {/* Botão de logout */}
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
    </aside>
  );
}