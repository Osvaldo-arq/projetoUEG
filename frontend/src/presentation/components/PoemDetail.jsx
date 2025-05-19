import React, { useState, useEffect, useContext } from 'react'; // Importa funcionalidades do React: estado, efeitos e contexto
import { useParams, useNavigate } from 'react-router-dom'; // Importa hooks para acessar parâmetros da rota e navegar
import PoemService from '../../application/PoemService'; // Importa o serviço para buscar dados de poemas
import LikeService from '../../application/LikeService'; // Importa o serviço para lidar com curtidas
import CommentService from '../../application/CommentService'; // Importa o serviço para lidar com comentários
import { AuthContext } from '../../context/AuthContext'; // Importa o contexto de autenticação
import styles from '../../styles/PoemDetail.module.css'; // Importa os estilos CSS para este componente
import Navbar from '../components/Navbar'; // Importa o componente da barra de navegação

export default function PoemDetail({ onChangeView }) { // Define o componente funcional PoemDetail, recebendo onChangeView (para navegação interna)
  const { id: poemIdFromRoute } = useParams(); // Obtém o valor do parâmetro 'id' da URL e o renomeia para poemIdFromRoute
  const navigate = useNavigate(); // Hook para obter a função de navegação
  const { user, authLoading, authRestored } = useContext(AuthContext); // Acessa os valores do contexto de autenticação: informações do usuário, estado de carregamento da autenticação e se a autenticação foi restaurada

  // Estados locais do componente para gerenciar os dados e a interface
  const [poem, setPoem] = useState(null); // Estado para armazenar os detalhes do poema
  const [likes, setLikes] = useState(0); // Estado para armazenar o número de curtidas do poema
  const [liked, setLiked] = useState(null); // Estado para indicar se o usuário atual curtiu o poema (true/false/null para carregando)
  const [comments, setComments] = useState([]); // Estado para armazenar a lista de comentários do poema
  const [newComment, setNewComment] = useState(''); // Estado para controlar o texto do novo comentário que o usuário está digitando
  const [editingCommentId, setEditingCommentId] = useState(null); // Estado para armazenar o ID do comentário que está sendo editado
  const [editText, setEditText] = useState(''); // Estado para armazenar o texto do comentário durante a edição
  const [error, setError] = useState(null); // Estado para armazenar qualquer mensagem de erro que ocorra durante as chamadas de API
  const [loadingPoem, setLoadingPoem] = useState(true); // Estado para indicar se os dados do poema estão sendo carregados da API
  const [checkingLike, setCheckingLike] = useState(true); // Estado para indicar se a verificação da curtida do usuário está em andamento

  const poemId = poemIdFromRoute; // Define uma variável poemId com o valor obtido da rota

  // useEffect: Executa efeitos colaterais no componente. Neste caso, carrega os dados do poema quando o componente é montado ou quando poemId muda.
  useEffect(() => {
    async function loadPoemData() {
      setLoadingPoem(true); // Define o estado de carregamento como verdadeiro ao iniciar a busca
      setError(null); // Limpa qualquer erro anterior
      try {
        const data = await PoemService.getById(poemId); // Chama a função do serviço para buscar os detalhes do poema pelo ID
        setPoem(data); // Atualiza o estado do poema com os dados recebidos
        const count = await LikeService.countLikes(poemId); // Chama a função do serviço para obter a contagem de curtidas do poema
        setLikes(count); // Atualiza o estado de curtidas com a contagem recebida
      } catch (e) {
        setError(e.message || 'Erro ao carregar poema'); // Se ocorrer um erro, atualiza o estado de erro
      } finally {
        setLoadingPoem(false); // Define o estado de carregamento como falso após a conclusão da busca (com sucesso ou falha)
      }
    }

    if (poemId) { // Garante que poemId tenha um valor antes de tentar carregar os dados
      loadPoemData(); // Chama a função para carregar os dados do poema
    }
  }, [poemId]); // A dependência [poemId] garante que este efeito seja executado novamente se o ID do poema na rota mudar

  // useEffect: Executa a verificação se o usuário atual curtiu o poema. Depende do ID do poema e do estado de autenticação.
  useEffect(() => {
    async function checkLikedStatus() {
      if (authRestored && !authLoading && user?.token) { // Verifica se a autenticação foi restaurada, não está carregando e o usuário possui um token
        setCheckingLike(true); // Define o estado de verificação de curtida como verdadeiro
        try {
          const hasLikedStatusResult = await LikeService.hasLiked(poemId); // Chama o serviço para verificar se o usuário curtiu o poema
          setLiked(hasLikedStatusResult); // Atualiza o estado liked com o resultado da verificação
        } catch (error) {
          console.error('Erro ao verificar se curtiu:', error);
          setLiked(false); // Em caso de erro, assume que o usuário não curtiu
        } finally {
          setCheckingLike(false); // Define o estado de verificação de curtida como falso após a conclusão
        }
      } else {
        setLiked(false); // Se a autenticação não estiver pronta ou não houver token, assume que o usuário não curtiu
        setCheckingLike(false);
      }
    }

    checkLikedStatus(); // Chama a função para verificar o status da curtida
  }, [poemId, user, authLoading, authRestored]); // Dependências: executa novamente se algum desses valores mudar

  // useEffect: Carrega os comentários associados ao poema. Executa quando o componente é montado ou quando poemId muda.
  useEffect(() => {
    async function loadComments() {
      try {
        const comms = await CommentService.listByPoem(poemId); // Chama o serviço para obter a lista de comentários do poema
        setComments(comms); // Atualiza o estado de comentários com a lista recebida
      } catch (err) {
        console.error('Erro ao carregar comentários:', err);
        setComments([]); // Em caso de erro, define a lista de comentários como um array vazio
      }
    }

    if (poemId) { // Garante que poemId tenha um valor antes de tentar carregar os comentários
      loadComments(); // Chama a função para carregar os comentários
    }
  }, [poemId]); // A dependência [poemId] garante que este efeito seja executado novamente se o ID do poema mudar

  // Função assíncrona para lidar com a ação de curtir ou descurtir o poema
  const toggleLike = async () => {
    if (!user?.token) return navigate('/login'); // Se não houver token de usuário, redireciona para a página de login
    try {
      const optimisticLiked = !liked; // Atualiza o estado de curtida local de forma otimista (antes da resposta da API)
      setLiked(optimisticLiked);
      setLikes(prevLikes => (optimisticLiked ? prevLikes + 1 : prevLikes - 1)); // Atualiza a contagem de curtidas local de forma otimista

      if (optimisticLiked) {
        await LikeService.like(poemId); // Chama o serviço para curtir o poema na API
      } else {
        await LikeService.unlike(poemId); // Chama o serviço para descurtir o poema na API
      }
    } catch (e) {
      console.error('Erro ao alternar like:', e);
      setLiked(!liked); // Em caso de erro, reverte o estado de curtida local
      setLikes(prevLikes => (!liked ? prevLikes + 1 : prevLikes - 1)); // Em caso de erro, reverte a contagem de curtidas local
    }
  };

  // Função assíncrona para lidar com o envio de um novo comentário
  const submitComment = async e => {
    e.preventDefault(); // Evita o comportamento padrão de envio do formulário (recarregar a página)
    if (!user?.token) return navigate('/login'); // Se não houver token de usuário, redireciona para a página de login
    try {
      const dto = {
        poemId: poemId,
        content: newComment
      };
      const created = await CommentService.create(dto); // Chama o serviço para criar o novo comentário na API
      setComments(prev => [created, ...prev]); // Atualiza o estado de comentários local, adicionando o novo comentário ao início da lista
      setNewComment(''); // Limpa o campo de texto do novo comentário
    } catch (e) {
      setError(e.message || 'Erro ao enviar comentário'); // Em caso de erro, atualiza o estado de erro
    }
  };

  // Função para preparar a edição de um comentário específico
  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id); // Define o ID do comentário que está sendo editado
    setEditText(comment.content); // Preenche o campo de edição com o texto atual do comentário
  };

  // Função assíncrona para salvar a edição de um comentário
  const handleSaveEdit = async (commentId) => {
    if (!user?.token) return navigate('/login'); // Se não houver token de usuário, redireciona para a página de login
    try {
      await CommentService.update(commentId, { content: editText }); // Chama o serviço para atualizar o comentário na API
      const updatedComments = comments.map(c =>
        c.id === commentId ? { ...c, content: editText } : c // Atualiza o texto do comentário na lista local de comentários
      );
      setComments(updatedComments); // Atualiza o estado de comentários com a lista modificada
      setEditingCommentId(null); // Limpa o ID do comentário sendo editado
      setEditText(''); // Limpa o campo de texto de edição
    } catch (error) {
      setError(error.message || 'Erro ao editar comentário'); // Em caso de erro, atualiza o estado de erro
    }
  };

  // Função para cancelar a edição de um comentário
  const handleCancelEdit = () => {
    setEditingCommentId(null); // Limpa o ID do comentário sendo editado
    setEditText(''); // Limpa o campo de texto de edição
  };

  // Função assíncrona para apagar um comentário
  const handleDeleteComment = async (commentId) => {
    if (!user?.token) return navigate('/login'); // Se não houver token de usuário, redireciona para a página de login
    if (window.confirm('Tem certeza que deseja apagar este comentário?')) { // Exibe uma caixa de confirmação para o usuário
      try {
        await CommentService.delete(commentId); // Chama o serviço para apagar o comentário da API
        const updatedComments = comments.filter(c => c.id !== commentId); // Filtra a lista local de comentários, removendo o comentário apagado
        setComments(updatedComments); // Atualiza o estado de comentários com a lista modificada
      } catch (error) {
        setError(error.message || 'Erro ao apagar comentário'); // Em caso de erro, atualiza o estado de erro
      }
    }
  };

  // Renderização condicional para exibir mensagens de erro ou tela de carregamento
  if (error) return <p className={styles.error}>{error}</p>; // Se houver um erro, exibe a mensagem de erro
  if (loadingPoem || !poem) return <p className={styles.loading}>Carregando poema...</p>; // Se os dados do poema estiverem carregando ou ainda não tiverem sido carregados, exibe uma mensagem de carregamento

  // Renderização principal do componente PoemDetail
  return (
    <div>
      <Navbar onChangeView={onChangeView} /> {/* Renderiza o componente Navbar, passando a função onChangeView para lidar com mudanças de visualização (se necessário) */}
      <div className={styles.container}>
        <img src={poem.imageUrl} alt={poem.title} className={styles.image} /> {/* Exibe a imagem do poema */}
        <h1 className={styles.title}>{poem.title}</h1> {/* Exibe o título do poema */}
        <p className={styles.author}>por {poem.author}</p> {/* Exibe o autor do poema */}
        <div className={styles.textContent}>
          {(poem.text || '').split("\n").map((line, idx) => ( // Divide o texto do poema por quebras de linha e renderiza cada linha em um <p>
            <p key={idx}>{line}</p>
          ))}
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={toggleLike}
            className={styles.likeButton}
            disabled={authLoading || checkingLike || liked === null} // Desabilita o botão de curtir durante o carregamento da autenticação, verificação de curtida ou se o estado de curtida for desconhecido
          >
            {liked === true ? 'Descurtir' : 'Curtir'} ({likes}) {/* Exibe o texto do botão com base no estado de curtida e a contagem de curtidas */}
          </button>
          {(authLoading || checkingLike) && <span className={styles.loading}>Verificando...</span>} {/* Exibe uma mensagem de carregamento durante a verificação da curtida */}
        </div>

        <div className={styles.commentSection}>
          <h2>Comentários</h2>
          {user?.token ? ( // Se o usuário estiver autenticado (possui um token), exibe o formulário de comentário
            <form onSubmit={submitComment} className={styles.commentForm}>
              <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                required
                placeholder="Escreva seu comentário..."
              />
              <button type="submit" disabled={authLoading}>Enviar</button> {/* Desabilita o botão de enviar durante o carregamento da autenticação */}
            </form>
          ) : (
            <p className={styles.loginPrompt} onClick={() => navigate('/login')}>
              Faça login para comentar
            </p>
          )}

          <ul className={styles.commentList}>
            {comments.length > 0 ? ( // Se houver comentários na lista, os renderiza
              comments.map(c => (
                <li key={c.id} className={styles.commentItem}>
                  <div>
                    <strong>{c.author || 'Anônimo'}</strong> {/* Exibe o autor do comentário ou 'Anônimo' se não houver */}
                    <em>{c.commentDate || ''}</em> {/* Exibe a data do comentário */}
                    {user?.token && user.id === c.authorId && ( // Se o usuário estiver autenticado e for o autor deste comentário, exibe as ações de edição e exclusão
                      <div className={styles.commentActions}>
                        {editingCommentId === c.id ? ( // Se este comentário estiver sendo editado, exibe os controles de edição
                          <>
                            <input
                              type="text"
                              value={editText}
                              onChange={e => setEditText(e.target.value)}
                            />
                            <button onClick={() => handleSaveEdit(c.id)}>Salvar</button>
                            <button onClick={handleCancelEdit}>Cancelar</button>
                          </>
                        ) : ( // Caso contrário, exibe os botões de editar e apagar
                          <>
                            <button onClick={() => handleEditComment(c)}>Editar</button>
                            <button onClick={() => handleDeleteComment(c.id)}>Apagar</button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    {editingCommentId === c.id ? null : c.content} {/* Exibe o conteúdo do comentário, ou nada se estiver em modo de edição */}
                  </div>
                </li>
              ))
            ) : (
              <p className={styles.noComments}>Nenhum comentário ainda.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}