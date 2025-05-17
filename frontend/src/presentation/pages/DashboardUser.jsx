import React, { useState, useEffect } from 'react';
import Sidebar from '../components/SidebarUser';
import ProfileService from '../../application/ProfileService';
import ProfileList from '../components/ProfileListUser';
import ProfileForm from '../components/ProfileForm';
import UserService from '../../application/UserService';
import UserList from '../components/UserListUser';
import UserForm from '../components/UserFormUser';
import styles from '../../styles/DashboardUser.module.css';

/**
 * DashboardUser Component:
 *
 * Este componente representa o painel do usuário, fornecendo funcionalidades para gerenciar o perfil e os dados do usuário.
 * Ele inclui uma barra lateral para navegação e uma área de conteúdo principal para exibir e gerenciar esses dados.
 */
export default function DashboardUser() {
  // Variáveis de estado:
  const [section, setSection] = useState('profile');       // Controla qual seção está sendo exibida ('profile' ou 'user')
  const [error, setError] = useState(null);           // Armazena mensagens de erro
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false); // Controla se a barra lateral está minimizada
  const [profiles, setProfiles] = useState([]);         // Armazena a lista de perfis (na prática, deve ter só 1)
  const [editingProfile, setEditingProfile] = useState(null); // Armazena o perfil que está sendo editado
  const [showProfileForm, setShowProfileForm] = useState(false); // Controla a visibilidade do formulário de perfil
  const [users, setUsers] = useState([]);             // Armazena a lista de usuários (na prática, deve ter só 1)
  const [editingUser, setEditingUser] = useState(null); // Armazena o usuário que está sendo editado
  const [showUserForm, setShowUserForm] = useState(false); // Controla a visibilidade do formulário de usuário
  const [loading, setLoading] = useState(true);       // Indica se os dados estão sendo carregados

  // Efeito para carregar os dados do perfil e do usuário ao montar o componente
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Inicia o carregamento
      try {
        // Busca o email do usuário do localStorage
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
          throw new Error('Email do utilizador não encontrado no localStorage');
        }
        // Carrega os dados do perfil e do usuário usando o email
        await loadProfile(userEmail);
        await loadUser(userEmail);
      } catch (error) {
        setError(error.message); // Armazena qualquer erro ocorrido
      } finally {
        setLoading(false); // Finaliza o carregamento, independentemente de sucesso ou falha
      }
    };
    fetchData();
  }, []);

  // Função para carregar os dados do perfil do usuário
  const loadProfile = async (userEmail) => {
    try {
      const profileData = await ProfileService.getByEmail(userEmail); // Busca o perfil pelo email
      setProfiles([profileData]); // Atualiza o estado com os dados do perfil
    } catch (error) {
      setError(error.message); // Armazena erros
    }
  };

  // Função para carregar os dados do usuário
  const loadUser = async (userEmail) => {
    try {
      const user = await UserService.getByEmail(userEmail);       // Busca o usuário pelo email
      setUsers([user]);           // Atualiza o estado com os dados do usuário
    } catch (error) {
      setError(error.message); // Armazena erros
    }
  };

  // Função para iniciar a edição do perfil
  const handleProfileEdit = (profile) => {
    setEditingProfile(profile); // Define o perfil a ser editado
    setShowProfileForm(true);  // Exibe o formulário de perfil
  };

  // Função para lidar com o envio do formulário de perfil (criação ou atualização)
  const handleProfileSubmit = async (data) => {
    try {
      await ProfileService.create(data); // Cria ou atualiza o perfil
      setShowProfileForm(false);    // Oculta o formulário
      const userEmail = localStorage.getItem('userEmail'); // Obtém email do usuário
      await loadProfile(userEmail);     // Recarrega os dados do perfil
    } catch (e) {
      setError(e.message); // Armazena erros
    }
  };

  // Função para iniciar a edição do usuário
  const handleUserEdit = (user) => {
    setEditingUser(user);   // Define o usuário a ser editado
    setShowUserForm(true);  // Exibe o formulário de usuário
  };

  // Função para lidar com o envio do formulário de usuário (atualização)
  const handleUserSubmit = async (data) => {
    try {
      await UserService.update(data.id, data); // Atualiza o usuário
      setShowUserForm(false);   // Oculta o formulário
      const userEmail = localStorage.getItem('userEmail'); // Obtém email
      await loadUser(userEmail);        // Recarrega dados do usuário
    } catch (e) {
      setError(e.message); // Armazena erros
    }
  };

  // Função para alternar a visibilidade da barra lateral
  const toggleSidebar = () => setIsSidebarMinimized((prev) => !prev);
  // Função para lidar com o logout
  const handleLogout = () => {
    localStorage.removeItem('token');     // Remove token
    localStorage.removeItem('userEmail'); // Remove email
    localStorage.removeItem('userName');  // Remove nome
    window.location.href = '/';       // Redireciona para login
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
        <h1 className={styles.title}>Meu Painel</h1>
        {/* Exibe mensagem de erro, se houver */}
        {error && <p className={styles.error}>{error}</p>}
        {/* Exibe indicador de carregamento enquanto os dados são buscados */}
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <>
            {/* Seção de gerenciamento de perfil */}
            {section === 'profile' && (
              <section>
                {/* Se o formulário de perfil não estiver sendo exibido, mostra a lista */}
                {!showProfileForm ? (
                  <ProfileList profiles={profiles} onEdit={handleProfileEdit} onDelete={() => {}} />
                ) : (
                  // Caso contrário, mostra o formulário de perfil
                  <ProfileForm
                    profile={editingProfile} // Passa o perfil para edição (ou null para novo)
                    onSubmit={handleProfileSubmit} // Passa a função para salvar
                    onCancel={() => setShowProfileForm(false)} // Passa a função para cancelar
                  />
                )}
              </section>
            )}
            {/* Seção de gerenciamento de usuário */}
            {section === 'user' && (
              <section>
                {/* Se o formulário de usuário não estiver sendo exibido, mostra a lista */}
                {!showUserForm ? (
                  <UserList users={users} onEdit={handleUserEdit} onDelete={() => {}} />
                ) : (
                  // Caso contrário, mostra o formulário de usuário
                  <UserForm
                    user={editingUser}   // Passa o usuário para edição
                    onSubmit={handleUserSubmit} // Passa função para salvar
                    onCancel={() => setShowUserForm(false)} // Passa função para cancelar
                  />
                )}
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
