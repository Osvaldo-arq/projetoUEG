import React, { useState, useEffect } from 'react';

import PoemService from '../../application/PoemService';       // Importa o serviço para manipulação de poemas.
import PoemList from '../components/PoemList';         // Importa o componente para exibir a lista de poemas.
import PoemForm from '../components/PoemForm';         // Importa o componente para o formulário de poema.

import ProfileService from '../../application/ProfileService'; // Importa o serviço para manipulação de perfis.
import ProfileList from '../components/ProfileList';       // Importa o componente para exibir a lista de perfis.
import ProfileForm from '../components/ProfileForm';       // Importa o componente para o formulário de perfil.


/**
 * DashboardAdmin Component:
 *
 * Este componente representa o painel de administração, fornecendo funcionalidades para gerenciar poemas e perfis.
 * Ele inclui uma barra lateral para navegação e uma área de conteúdo principal para exibir e gerenciar dados.
 */
export default function DashboardAdmin() {
  // Variáveis de estado:
  const [section, setSection] = useState('poems');       // Controla qual seção é exibida ('poems', 'profiles', 'users').
  const [error, setError] = useState(null);           // Armazena quaisquer mensagens de erro.

  // Estado relacionado a poemas:
  const [poems, setPoems] = useState([]);             // Armazena a lista de poemas.
  const [editingPoem, setEditingPoem] = useState(null); // Armazena o poema que está sendo editado.
  const [showPoemForm, setShowPoemForm] = useState(false); // Controla a visibilidade do formulário de poema.

  // Estado relacionado a perfis:
  const [profiles, setProfiles] = useState([]);         // Armazena a lista de perfis.
  const [editingProfile, setEditingProfile] = useState(null); // Armazena o perfil que está sendo editado.
  const [showProfileForm, setShowProfileForm] = useState(false); // Controla a visibilidade do formulário de perfil.


  /**
   * useEffect Hook:
   *
   * Este hook é usado para carregar os dados iniciais quando o componente é montado. Ele chama loadPoems e loadProfiles.
   *
   * Dependências: [] - Este efeito é executado apenas uma vez, quando o componente é montado.
   */
  useEffect(() => {
    loadPoems();    // Carrega os poemas quando o componente é montado.
    loadProfiles(); // Carrega os perfis quando o componente é montado.
  }, []);

  /**
   * loadPoems Function:
   *
   * Busca a lista de poemas do PoemService e atualiza o estado 'poems'.
   * Trata erros e atualiza o estado 'error' se necessário.
   */
  const loadPoems = async () => {
    try {
      setPoems(await PoemService.listAll()); // Busca os poemas e atualiza o estado.
    } catch (e) {
      setError(e.message); // Armazena a mensagem de erro.
    }
  };

  /**
   * loadProfiles Function:
   *
   * Busca a lista de perfis do ProfileService e atualiza o estado 'profiles'.
   * Trata erros e atualiza o estado 'error' se necessário.
   */
  const loadProfiles = async () => {
    try {
      setProfiles(await ProfileService.listAll()); // Busca os perfis e atualiza o estado.
    } catch (e) {
      setError(e.message); // Armazena a mensagem de erro.
    }
  };


  // Handlers de Poemas:
  /**
   * handlePoemSubmit Function:
   *
   * Lida com o envio do formulário de poema (tanto criar quanto atualizar). Ele chama o método apropriado do PoemService
   * (create ou update) e então recarrega a lista de poemas. Ele também reseta o estado do formulário.
   *
   * @param poem Os dados do poema do formulário.
   */
  const handlePoemSubmit = async (poem) => {
    try {
      if (editingPoem) {
        await PoemService.update(editingPoem.id, poem); // Atualiza o poema existente.
      } else {
        await PoemService.create(poem);            // Cria um novo poema.
      }
      setShowPoemForm(false);    // Oculta o formulário após o envio.
      setEditingPoem(null);     // Reseta o estado de edição.
      loadPoems();             // Recarrega a lista de poemas.
    } catch (e) {
      setError(e.message); // Armazena a mensagem de erro.
    }
  };

  /**
   * handlePoemDelete Function:
   *
   * Lida com a exclusão de um poema pelo seu ID. Ele chama o método PoemService.deleteById e
   * então recarrega a lista de poemas. Ele também trata erros.
   *
   * @param id O ID do poema a ser excluído.
   */
  const handlePoemDelete = async (id) => {
    try {
      await PoemService.deleteById(id); // Exclui o poema.
      loadPoems();                 // Recarrega a lista de poemas.
    } catch (e) {
      setError(e.message); // Armazena a mensagem de erro.
    }
  };

  // Handlers de Perfil:
  /**
   * handleProfileSubmit Function:
   *
   * Lida com o envio do formulário de perfil. Ele chama o método ProfileService.create
   * e então recarrega a lista de perfis. Ele também reseta o estado do formulário.
   *
   * @param profile Os dados do perfil do formulário.
   */
  const handleProfileSubmit = async (profile) => {
    try {
      await ProfileService.create(profile); // Cria um novo perfil
      setShowProfileForm(false);   // Oculta o formulário
      setEditingProfile(null);    // Reseta o estado de edição
      loadProfiles();            // Recarrega a lista de perfis
    } catch (e) {
      setError(e.message);
    }
  };

  /**
   * handleProfileDelete Function:
   *
   * Lida com a exclusão de um perfil pelo seu email. Ele chama o método ProfileService.deleteByEmail e
   * então recarrega a lista de perfis.
   *
   * @param email O email do perfil a ser excluído.
   */
  const handleProfileDelete = async (email) => {
    try {
      await ProfileService.deleteByEmail(email);  // Exclui o perfil pelo email
      loadProfiles();                     // Carrega os perfis
    } catch (e) {
      setError(e.message);
    }
  };

  // Handler de Logout:
  /**
   * handleLogout Function:
   *
   * Lida com o logout do usuário. Ele remove o token de autenticação do localStorage e redireciona o usuário
   * para a página de login.
   */
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove o token
    window.location.href = '/login';  // Redireciona para a página de login
  };

  // Renderiza o componente:
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Barra Lateral */}
      <aside style={{
        width: '220px',             // Largura fixa para a barra lateral.
        background: '#f0f0f0',      // Fundo cinza claro.
        padding: '1rem',           // Preenchimento dentro da barra lateral.
        display: 'flex',          // Usa flexbox para o layout.
        flexDirection: 'column'    // Empilha os itens verticalmente.
      }}>
        <h2>Admin</h2>
        <nav style={{
          display: 'flex',          // Usa flexbox para os itens de navegação.
          flexDirection: 'column',    // Empilha os itens de navegação verticalmente.
          gap: '0.5rem',         // Espaço entre os itens de navegação.
          marginTop: '1rem'         // Espaço acima da navegação.
        }}>
          {/* Botões para alternar entre as seções. */}
          <button onClick={() => setSection('poems')} style={{ textAlign: 'left' }}>
            Gerenciar Poemas
          </button>
          <button onClick={() => setSection('profiles')} style={{ textAlign: 'left' }}>
            Gerenciar Perfis
          </button>
          <button onClick={() => setSection('users')} style={{ textAlign: 'left' }}>
            Gerenciar Usuários
          </button>
        </nav>
        {/* Botão de Logout, posicionado na parte inferior da barra lateral. */}
        <button
          onClick={handleLogout}
          style={{
            marginTop: 'auto',        // Empurra o botão para a parte inferior.
            background: '#d9534f', // Fundo vermelho.
            color: '#fff',         // Texto branco.
            padding: '0.5rem',       // Preenchimento dentro do botão.
            width: '100%'          // Largura total da barra lateral.
          }}
        >
          Logout
        </button>
      </aside>

      {/* Área de Conteúdo Principal */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <h1>Dashboard Admin</h1>

        {/* Renderização condicional das seções. */}
        {section === 'poems' && (
          <section>
            <h2>Gerenciar Poemas</h2>
            {/* Botão para exibir o formulário de poema para criar um novo poema. */}
            <button onClick={() => { setShowPoemForm(true); setEditingPoem(null); }}>
              Novo Poema
            </button>
            {/* Renderiza o formulário de poema se showPoemForm for verdadeiro. */}
            {showPoemForm && (
              <PoemForm
                poem={editingPoem}        // Passa o poema que está sendo editado (null para novo).
                onSubmit={handlePoemSubmit} // Passa o manipulador de envio.
                onCancel={() => { setShowPoemForm(false); setEditingPoem(null); }} // Passa o manipulador de cancelamento.
              />
            )}
            {/* Renderiza a lista de poemas. */}
            <PoemList
              poems={poems}             // Passa a lista de poemas.
              onEdit={p => { setEditingPoem(p); setShowPoemForm(true); }} // Passa o manipulador de edição.
              onDelete={handlePoemDelete} // Passa o manipulador de exclusão.
            />
          </section>
        )}

        {section === 'profiles' && (
          <section>
            <h2>Gerenciar Perfis</h2>
            {/* Botão para exibir o formulário de perfil */}
            <button onClick={() => { setShowProfileForm(true); setEditingProfile(null); }}>
              Novo Perfil
            </button>
            {/* Exibe o formulário de perfil se showProfileForm for verdadeiro */}
            {showProfileForm && (
              <ProfileForm
                profile={editingProfile}
                onSubmit={handleProfileSubmit}
                onCancel={() => { setShowProfileForm(false); setEditingProfile(null); }}
              />
            )}
            {/* Renderiza a lista de perfis */}
            <ProfileList
              profiles={profiles}
              onEdit={p => { setEditingProfile(p); setShowProfileForm(true); }}
              onDelete={handleProfileDelete}
            />
          </section>
        )}

        {/* Exibe quaisquer erros. */}
        {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
      </main>
    </div>
  );
}
