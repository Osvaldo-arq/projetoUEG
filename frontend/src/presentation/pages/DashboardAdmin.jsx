import React, { useState, useEffect } from 'react';
import PoemService from '../../application/PoemService'; // Importa o serviço para operações relacionadas a poemas.
import PoemList from '../components/PoemList';       // Importa o componente para exibir a lista de poemas.
import PoemForm from '../components/PoemForm';       // Importa o componente para o formulário de criação/edição de poemas.

/**
 * Componente para o dashboard administrativo, responsável pelo CRUD (Criar, Ler, Atualizar, Deletar) de poemas.
 * Este componente permite aos administradores gerenciar os poemas exibidos na aplicação.
 */
export default function DashboardAdmin() {
  const [poems, setPoems] = useState([]);         // Estado para armazenar a lista de poemas.
  const [editing, setEditing] = useState(null);     // Estado para armazenar o poema que está sendo editado (null se nenhum).
  const [showForm, setShowForm] = useState(false); // Estado para controlar a exibição do formulário de poema.
  const [error, setError] = useState(null);         // Estado para armazenar mensagens de erro.

  /**
   * Função para recarregar a lista de poemas.
   * Busca todos os poemas do serviço e atualiza o estado 'poems'.
   */
  const reload = () => {
    PoemService.listAll()
      .then(setPoems) // Atualiza o estado 'poems' com a lista de poemas recebida.
      .catch(err => setError(err.message)); // Captura erros e atualiza o estado 'error'.
  };

  // Efeito para carregar a lista de poemas na inicialização do componente.
  useEffect(reload, []); // Executa 'reload' apenas uma vez, na montagem do componente.

  /**
   * Função para lidar com o salvamento de um poema (novo ou existente).
   * Chama o serviço para criar ou atualizar o poema e, em caso de sucesso,
   * atualiza a lista de poemas e reseta o estado do formulário.
   * @param dto Os dados do poema a serem salvos.
   */
  const handleSave = (dto) => {
    PoemService.createOrUpdate(dto)
      .then(() => {
        setShowForm(false); // Esconde o formulário após o salvamento bem-sucedido.
        setEditing(null);    // Reseta o estado de edição.
        reload();           // Recarrega a lista de poemas para exibir as alterações.
      })
      .catch(err => setError(err.message)); // Captura erros e atualiza o estado 'error'.
  };

  /**
   * Função para lidar com a exclusão de um poema.
   * Exibe uma confirmação antes de excluir o poema e, em caso de confirmação,
   * chama o serviço para excluir o poema e atualiza a lista de poemas.
   * @param id O ID do poema a ser excluído.
   */
  const handleDelete = (id) => {
    if (!window.confirm('Confirma exclusão do poema?')) return; // Exibe diálogo de confirmação.
    PoemService.deleteById(id)
      .then(reload)           // Recarrega a lista de poemas após a exclusão bem-sucedida.
      .catch(err => setError(err.message)); // Captura erros e atualiza o estado 'error'.
  };

  // Renderiza o componente.
  return (
    <div>
      <h1>Dashboard Admin — CRUD de Poemas</h1> {/* Título da página. */}
      {error && <div style={{ color: 'red' }}>{error}</div>} {/* Exibe mensagens de erro, se houver. */}

      {!showForm && (
        // Botão para exibir o formulário de criação de um novo poema.
        <button onClick={() => { setEditing(null); setShowForm(true); }}>
          Novo Poema
        </button>
      )}

      {showForm && (
        // Renderiza o formulário de poema.  Se 'editing' tiver um valor, o formulário será usado para edição.
        <PoemForm
          initial={editing}                                         // Passa o poema a ser editado (ou null para novo poema).
          onSave={handleSave}                                       // Passa a função para salvar o poema.
          onCancel={() => { setShowForm(false); setEditing(null); }} // Passa a função para cancelar a operação.
        />
      )}

      {/* Renderiza a lista de poemas. */}
      <PoemList
        poems={poems}                                           // Passa a lista de poemas para exibição.
        onEdit={p => { setEditing(p); setShowForm(true); }} // Passa a função para iniciar a edição de um poema.
        onDelete={handleDelete}                                   // Passa a função para excluir um poema.
      />
    </div>
  );
}

