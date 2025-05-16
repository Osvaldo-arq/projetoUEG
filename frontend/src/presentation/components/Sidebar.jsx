import React from 'react';
import { FaBars, FaTimes } from 'react-icons/fa'; // Importa ícones para barra de menu e fechar
import styles from '../../styles/Sidebar.module.css'; // Importa estilos CSS para o componente

/**
 * Componente Sidebar:
 *
 * Este componente representa a barra lateral de navegação da aplicação administrativa.
 * Ele exibe um título, um botão para minimizar/maximizar a barra lateral,
 * links de navegação para diferentes seções e um botão de logout.
 */
export default function Sidebar({
  isMinimized,      // Prop: Indica se a barra lateral está minimizada
  toggleSidebar,    // Prop: Função para alternar o estado de minimização da barra lateral
  setSection,       // Prop: Função para definir a seção ativa da aplicação
  handleLogout      // Prop: Função para lidar com o logout do usuário
}) {
  return (
    <aside className={`${styles.sidebar} ${isMinimized ? styles.sidebarMinimized : ''}`}>
      {/* Título da barra lateral */}
      <h2>Admin</h2>

      {/* Botão para minimizar/maximizar a barra lateral */}
      <button onClick={toggleSidebar} className={styles.toggleSidebarButton}>
        {isMinimized ? <FaBars /> : <FaTimes />}  {/* Exibe ícone de barra quando minimizada, X quando maximizada */}
      </button>

      {/* Navegação da barra lateral */}
      <nav>
        {/* Botão para a seção de gerenciamento de poemas */}
        <button onClick={() => setSection('poems')} className={styles.navButton}>Gerenciar Poemas</button>
        {/* Botão para a seção de gerenciamento de perfis */}
        <button onClick={() => setSection('profiles')} className={styles.navButton}>Gerenciar Perfis</button>
        {/* Botão para a seção de gerenciamento de usuários */}
        <button onClick={() => setSection('users')} className={styles.navButton}>Gerenciar Usuários</button>
      </nav>

      {/* Botão de logout */}
      <button onClick={handleLogout} className={styles.logoutButton}>
        Logout
      </button>
    </aside>
  );
}
