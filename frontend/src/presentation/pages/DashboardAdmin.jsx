import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa'; // Importa os ícones de barra e X para o menu

import PoemService from '../../application/PoemService';       // Importa o serviço para manipulação de poemas
import PoemList from '../components/PoemList';         // Importa o componente para exibir a lista de poemas
import PoemForm from '../components/PoemForm';         // Importa o componente para o formulário de poema
import Sidebar from '../components/Sidebar';       

import ProfileService from '../../application/ProfileService'; // Importa o serviço para manipulação de perfis
import ProfileList from '../components/ProfileList';       // Importa o componente para exibir a lista de perfis
import ProfileForm from '../components/ProfileForm';       // Importa o componente para o formulário de perfil

import UserService from '../../application/UserService';       // Importa o serviço para manipulação de usuários
import UserList from '../components/UserList';         // Importa o componente para exibir a lista de usuários
import UserForm from '../components/UserForm';         // Importa o componente para o formulário de usuário

import styles from '../../styles/DashboardAdmin.module.css'; // Importa os estilos CSS do componente

/**
 * DashboardAdmin Component:
 *
 * Este componente representa o painel de administração, fornecendo funcionalidades para gerenciar poemas, perfis e usuários.
 * Ele inclui uma barra lateral para navegação (com opção de minimizar) e uma área de conteúdo principal para exibir e gerenciar dados.
 */
export default function DashboardAdmin() {
  // Variáveis de estado:
  const [section, setSection] = useState('poems');       // Controla qual seção está sendo exibida ('poems', 'profiles', 'users')
  const [error, setError] = useState(null);           // Armazena mensagens de erro
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false); // Controla se a barra lateral está minimizada

  // Estado relacionado a poemas:
  const [poems, setPoems] = useState([]);             // Armazena a lista de poemas
  const [editingPoem, setEditingPoem] = useState(null); // Armazena o poema que está sendo editado
  const [showPoemForm, setShowPoemForm] = useState(false); // Controla a visibilidade do formulário de poema

  // Estado relacionado a perfis:
  const [profiles, setProfiles] = useState([]);         // Armazena a lista de perfis
  const [editingProfile, setEditingProfile] = useState(null); // Armazena o perfil que está sendo editado
  const [showProfileForm, setShowProfileForm] = useState(false); // Controla a visibilidade do formulário de perfil

  // Estado relacionado a usuários:
  const [users, setUsers] = useState([]);             // Armazena a lista de usuários
  const [editingUser, setEditingUser] = useState(null); // Armazena o usuário que está sendo editado
  const [showUserForm, setShowUserForm] = useState(false); // Controla a visibilidade do formulário de usuário

  // Efeito para carregar dados iniciais
  useEffect(() => {
    loadPoems();    // Carrega a lista de poemas
    loadProfiles(); // Carrega a lista de perfis
    loadUsers();    // Carrega a lista de usuários
  }, []);

  // Função para carregar poemas
  const loadPoems = async () => {
    try {
      setPoems(await PoemService.listAll()); // Busca todos os poemas e atualiza o estado
    } catch (e) {
      setError(e.message); // Atualiza o estado de erro com a mensagem
    }
  };

  // Função para carregar perfis
  const loadProfiles = async () => {
    try {
      setProfiles(await ProfileService.listAll()); // Busca todos os perfis e atualiza o estado
    } catch (e) {
      setError(e.message); // Atualiza o estado de erro com a mensagem
    }
  };

  // Função para carregar usuários
  const loadUsers = async () => {
    try {
      setUsers(await UserService.listAll());     // Busca todos os usuários e atualiza o estado
    } catch (e) {
      setError(e.message); // Atualiza o estado de erro com a mensagem
    }
  };

  // Função para lidar com o envio do formulário de poema
  const handlePoemSubmit = async (poem) => {
    try {
      if (editingPoem && editingPoem.id) {
        await PoemService.update(editingPoem.id, poem); // Atualiza um poema existente
      } else {
        await PoemService.create(poem);            // Cria um novo poema
      }
      setShowPoemForm(false);    // Oculta o formulário de poema
      setEditingPoem(null);     // Reseta o estado de edição de edição
      loadPoems();             // Recarrega a lista de poemas
    } catch (e) {
      setError(e.message); // Atualiza o estado de erro
    }
  };

  // Função para lidar com a exclusão de um poema
  const handlePoemDelete = async (id) => {
    try {
      await PoemService.deleteById(id); // Exclui o poema pelo ID
      loadPoems();                 // Recarrega a lista de poemas
    } catch (e) {
      setError(e.message); // Atualiza o estado de erro
    }
  };

  // Função para lidar com o envio do formulário de perfil
  const handleProfileSubmit = async (profile) => {
    try {
      if (editingProfile && editingProfile.email) {
        await ProfileService.update(editingProfile.email, profile); // Atualiza um perfil existente
      } else {
        await ProfileService.create(profile);            // Cria um novo perfil
      }
      setShowProfileForm(false);   // Oculta o formulário de perfil
      setEditingProfile(null);    // Reseta o estado de edição de edição
      loadProfiles();            // Recarrega a lista de perfis
    } catch (e) {
      setError(e.message); // Atualiza o estado de erro
    }
  };

  // Função para lidar com a exclusão de um perfil
  const handleProfileDelete = async (email) => {
    try {
      await ProfileService.deleteByEmail(email); // Exclui o perfil pelo email
      loadProfiles();                     // Recarrega a lista de perfis
    } catch (e) {
      setError(e.message); // Atualiza o estado de erro
    }
  };

  // Função para lidar com o envio do formulário de usuário
  const handleUserSubmit = async (userData) => {
    try {
      if (editingUser && editingUser.id) {
        await UserService.update(editingUser.id, userData); // Atualiza um usuário existente
      } else {
        await UserService.create(userData);            // Cria um novo usuário
      }
      setShowUserForm(false);   // Oculta o formulário de usuário
      setEditingUser(null);    // Reseta o estado de edição de edição
      loadUsers();             // Recarrega a lista de usuários
    } catch (e) {
      setError(e.message); // Atualiza o estado de erro
    }
  };

  // Função para lidar com a exclusão de um usuário
  const handleUserDelete = async (id) => {
    try {
      await UserService.deleteById(id); // Exclui o usuário pelo ID
      loadUsers();                 // Recarrega a lista de usuários
    } catch (e) {
      setError(e.message); // Atualiza o estado de erro
    }
  };

  // Função para lidar com o logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove o token de autenticação
    window.location.href = '/login';  // Redireciona para a página de login
  };

  // Função para alternar a visibilidade da barra lateral
  const toggleSidebar = () => {
    setIsSidebarMinimized(!isSidebarMinimized); // Inverte o estado da barra lateral
  };

  // Renderiza o componente
  return (
    <div className={styles.dashboardContainer}>
      {/* Barra lateral */}
      <Sidebar
        isMinimized={isSidebarMinimized}
        toggleSidebar={toggleSidebar}
        setSection={setSection}
        handleLogout={handleLogout}
      />
      {/* Conteúdo principal */}
      <main className={`${styles.mainContent} ${isSidebarMinimized ? styles.mainContentMinimized : ''}`}>
        <h1>Dashboard Admin</h1>

        {/* Seção de gerenciamento de poemas */}
        {section === 'poems' && (
          <section>
            <h2>Gerenciar Poemas</h2>
            <button onClick={() => { setShowPoemForm(true); setEditingPoem(null); }} className={styles.actionButton}>
              Novo Poema
            </button>
            {showPoemForm && (
              <PoemForm
                initial={editingPoem}        // Passa o poema para edição (ou null para novo)
                onSave={handlePoemSubmit} // Passa a função para salvar o poema
                onCancel={() => { setShowPoemForm(false); setEditingPoem(null); }} // Passa a função para cancelar
              />
            )}
            <div className={styles.poemListContainer}>
              <PoemList
                poems={poems}             // Passa a lista de poemas
                onEdit={p => { setEditingPoem(p); setShowPoemForm(true); }} // Passa a função para editar um poema
                onDelete={handlePoemDelete} // Passa a função para excluir um poema
              />
            </div>
          </section>
        )}

        {/* Seção de gerenciamento de perfis */}
        {section === 'profiles' && (
          <section>
            <h2>Gerenciar Perfis</h2>
            <button onClick={() => { setShowProfileForm(true); setEditingProfile(null); }} className={styles.actionButton}>
              Novo Perfil
            </button>
            {showProfileForm && (
              <ProfileForm
                profile={editingProfile}      // Passa o perfil para edição (ou null para novo)
                onSubmit={handleProfileSubmit} // Passa a função para salvar o perfil
                onCancel={() => { setShowProfileForm(false); setEditingProfile(null); }} // Passa a função para cancelar
              />
            )}
            <div className={styles.profileListContainer}>
              <ProfileList
                profiles={profiles}         // Passa a lista de perfis
                onEdit={p => { setEditingProfile(p); setShowProfileForm(true); }} // Passa a função para editar um perfil
                onDelete={handleProfileDelete} // Passa a função para excluir um perfil
              />
            </div>
          </section>
        )}

        {/* Seção de gerenciamento de usuários */}
        {section === 'users' && (
          <section>
            <h2>Gerenciar Usuários</h2>
            <button onClick={() => { setShowUserForm(true); setEditingUser(null); }} className={styles.actionButton}>
              Novo Usuário
            </button>
            {showUserForm && (
              <UserForm
                user={editingUser}        // Passa o usuário para edição (ou null para novo)
                onSubmit={handleUserSubmit} // Passa a função para salvar o usuário
                onCancel={() => { setShowUserForm(false); setEditingUser(null); }} // Passa a função para cancelar
              />
            )}
            <div className={styles.userListContainer}>
              <UserList
                users={users}           // Passa a lista de usuários
                onEdit={user => { setEditingUser(user); setShowUserForm(true); }} // Passa a função para editar um usuário
                onDelete={handleUserDelete} // Passa a função para excluir um usuário
              />
            </div>
          </section>
        )}

        {/* Exibe mensagem de erro, se houver */}
        {error && <p className={styles.error}>{error}</p>}
      </main>
    </div>
  );
}
