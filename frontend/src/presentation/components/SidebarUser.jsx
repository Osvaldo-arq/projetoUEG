import React from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import styles from '../../styles/Sidebar.module.css';

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

  return (
    <aside className={`${styles.sidebar} ${isMinimized ? styles.sidebarMinimized : ''}`}>      
      <div className={styles.header}>
        <h2 className={styles.title}>{isMinimized ? 'Us' : 'Usuário'}</h2>
        <button onClick={toggleSidebar} className={styles.toggleSidebarButton}>          
          {isMinimized ? <FaBars /> : <FaTimes />}
        </button>
      </div>
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
      <button onClick={handleLogout} className={styles.logoutButton}>
        Logout
      </button>
    </aside>
  );
}