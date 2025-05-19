import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PoemService from '../../application/PoemService';
import LikeService from '../../application/LikeService';
import CommentService from '../../application/CommentService';
import { AuthContext } from '../../context/AuthContext';
import styles from '../../styles/PoemDetail.module.css'; // Importa os estilos CSS

/**
 * @component
 * @description Componente funcional para exibir os detalhes de um poema, incluindo curtidas e comentários,
 * com um estilo visual comum em sites de poesia.
 *
 * @param {object} props - As propriedades do componente.
 * @param {function} props.onChangeView - Função para manipular a mudança de visualização (passada do componente pai).
 *
 * @returns {JSX.Element} Elemento JSX representando os detalhes do poema estilizado.
 */
export default function PoemDetail({ onChangeView }) {
  /**
   * @constant {object} routeParams - Objeto contendo os parâmetros da rota.
   * @property {string} id - O ID do poema extraído da URL.
   */
  const { id: poemIdFromRoute } = useParams();
  const navigate = useNavigate();
  /**
   * @constant {object} auth - Objeto contendo informações do contexto de autenticação.
   * @property {object | null} user - Informações do usuário logado (se houver).
   * @property {boolean} authLoading - Indica se o estado de autenticação está sendo carregado.
   * @property {boolean} authRestored - Indica se o estado de autenticação foi restaurado.
   */
  const { user, authLoading, authRestored } = useContext(AuthContext);

  // Estados locais do componente
  const [poem, setPoem] = useState(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');
  const [error, setError] = useState(null);
  const [loadingPoem, setLoadingPoem] = useState(true);
  const [checkingLike, setCheckingLike] = useState(true);

  const poemId = poemIdFromRoute;

  /**
   * @useEffect
   * @description Carrega os dados do poema e a contagem de curtidas ao montar o componente ou quando o ID do poema muda.
   */
  useEffect(() => {
    async function loadPoemData() {
      setLoadingPoem(true);
      setError(null);
      try {
        const data = await PoemService.getById(poemId);
        setPoem(data);
        const count = await LikeService.countLikes(poemId);
        setLikes(count);
      } catch (e) {
        setError(e.message || 'Erro ao carregar poema');
      } finally {
        setLoadingPoem(false);
      }
    }
    if (poemId) {
      loadPoemData();
    }
  }, [poemId]);

  /**
   * @useEffect
   * @description Verifica se o usuário atual curtiu o poema ao montar o componente ou quando o ID do poema ou o estado de autenticação mudam.
   */
  useEffect(() => {
    async function checkLikedStatus() {
      if (authRestored && !authLoading && user?.token) {
        setCheckingLike(true);
        try {
          const hasLikedStatusResult = await LikeService.hasLiked(poemId);
          setLiked(hasLikedStatusResult);
        } catch (error) {
          console.error('Erro ao verificar se curtiu:', error);
          setLiked(false);
        } finally {
          setCheckingLike(false);
        }
      } else {
        setLiked(false);
        setCheckingLike(false);
      }
    }
    checkLikedStatus();
  }, [poemId, user, authLoading, authRestored]);

  /**
   * @useEffect
   * @description Carrega os comentários do poema ao montar o componente ou quando o ID do poema muda.
   */
  useEffect(() => {
    async function loadComments() {
      try {
        const comms = await CommentService.listByPoem(poemId);
        setComments(comms);
      } catch (err) {
        console.error('Erro ao carregar comentários:', err);
        setComments([]);
      }
    }
    if (poemId) {
      loadComments();
    }
  }, [poemId]);

  /**
   * @function toggleLike
   * @description Alterna a curtida do poema pelo usuário atual.
   * Se o usuário não estiver logado, redireciona para a página de login.
   */
  const toggleLike = async () => {
    if (!user?.token) return navigate('/login');
    try {
      const optimisticLiked = !liked;
      setLiked(optimisticLiked);
      setLikes(prevLikes => (optimisticLiked ? prevLikes + 1 : prevLikes - 1));

      if (optimisticLiked) {
        await LikeService.like(poemId);
      } else {
        await LikeService.unlike(poemId);
      }
    } catch (e) {
      console.error('Erro ao alternar like:', e);
      setLiked(!liked);
      setLikes(prevLikes => (!liked ? prevLikes + 1 : prevLikes - 1));
    }
  };

  /**
   * @function submitComment
   * @description Envia um novo comentário para o poema.
   * Se o usuário não estiver logado, redireciona para a página de login.
   * @param {object} e - O objeto de evento do formulário.
   */
  const submitComment = async e => {
    e.preventDefault();
    if (!user?.token) return navigate('/login');
    try {
      const dto = {
        poemId: poemId,
        content: newComment
      };
      const created = await CommentService.create(dto);
      setComments(prev => [created, ...prev]);
      setNewComment('');
    } catch (e) {
      setError(e.message || 'Erro ao enviar comentário');
    }
  };

  // Inicia a edição de um comentário específico
  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditText(comment.content);
  };

  /**
   * @function handleSaveEdit
   * @description Salva a edição de um comentário existente.
   * Se o usuário não estiver logado, redireciona para a página de login.
   * @param {string} commentId - O ID do comentário a ser salvo.
   */
  const handleSaveEdit = async (commentId) => {
    if (!user?.token) return navigate('/login');
    try {
      await CommentService.update(commentId, { content: editText });
      const updatedComments = comments.map(c =>
        c.id === commentId ? { ...c, content: editText } : c
      );
      setComments(updatedComments);
      setEditingCommentId(null);
      setEditText('');
    } catch (error) {
      setError(error.message || 'Erro ao editar comentário');
    }
  };

  // Cancela a edição de um comentário
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditText('');
  };

  /**
   * @function handleDeleteComment
   * @description Apaga um comentário específico.
   * Se o usuário não estiver logado, redireciona para a página de login.
   * Solicita confirmação ao usuário antes de apagar o comentário.
   * @param {string} commentId - O ID do comentário a ser apagado.
   */
  const handleDeleteComment = async (commentId) => {
    if (!user?.token) return navigate('/login');
    if (window.confirm('Tem certeza que deseja apagar este comentário?')) {
      try {
        await CommentService.delete(commentId);
        const updatedComments = comments.filter(c => c.id !== commentId);
        setComments(updatedComments);
      } catch (error) {
        setError(error.message || 'Erro ao apagar comentário');
      }
    }
  };

  // Renderização condicional para erros
  if (error) return <p className={styles.error}>{error}</p>;
  // Renderização condicional para tela de carregamento
  if (loadingPoem || !poem) return <p className={styles.loading}>Carregando poema...</p>;

  return (
    <div className={styles.container}> {/* Aplica o estilo de container */}
      <img src={poem.imageUrl} alt={poem.title} className={styles.image} /> {/* Aplica o estilo de imagem */}
      <h1 className={styles.title}>{poem.title}</h1> {/* Aplica o estilo de título */}
      <p className={styles.author}>por {poem.author}</p> {/* Aplica o estilo de autor */}
      <div className={styles.textContent}> {/* O nome da classe 'content' foi alterado para 'textContent' no seu código */}
        {/* O estilo para parágrafos já está definido em '.content p' */}
        {(poem.text || '').split("\n").map((line, idx) => (
          <p key={idx}>{line}</p>
        ))}
      </div>

      <div className={styles.actions}> {/* Aplica o estilo para as ações */}
        <button
          type="button"
          onClick={toggleLike}
          className={styles.likeButton} // Aplica o estilo do botão de curtir
          disabled={authLoading || checkingLike || liked === null}
        >
          {liked === true ? 'Descurtir' : 'Curtir'} ({likes})
        </button>
        {(authLoading || checkingLike) && <span className={styles.loading}>Verificando...</span>}
      </div>

      <div className={styles.commentSection}> {/* Aplica o estilo da seção de comentários */}
        <h2>Comentários</h2>
        {user?.token ? (
          <form onSubmit={submitComment} className={styles.commentForm}> {/* Aplica o estilo do formulário de comentário */}
            <textarea
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              required
              placeholder="Escreva seu comentário..."
            />
            <button type="submit" disabled={authLoading}>Enviar</button> {/* O estilo do botão de comentário já está definido em '.commentForm button' */}
          </form>
        ) : (
          <p className={styles.loginPrompt} onClick={() => navigate('/login')}>
            Faça login para comentar
          </p>
        )}

        <ul className={styles.commentList}> {/* Aplica o estilo da lista de comentários */}
          {comments.length > 0 ? (
            comments.map(c => (
              <li key={c.id} className={styles.commentItem}> {/* Aplica o estilo de cada item de comentário */}
                <div>
                  <strong>{c.author || 'Anônimo'}</strong>
                  <em>{c.commentDate || ''}</em>
                  {user?.token && user.id === c.authorId && (
                    <div className={styles.commentActions}>
                      {editingCommentId === c.id ? (
                        <>
                          <input
                            type="text"
                            value={editText}
                            onChange={e => setEditText(e.target.value)}
                          />
                          <button onClick={() => handleSaveEdit(c.id)}>Salvar</button>
                          <button onClick={handleCancelEdit}>Cancelar</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEditComment(c)}>Editar</button>
                          <button onClick={() => handleDeleteComment(c.id)}>Apagar</button>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  {editingCommentId === c.id ? null : c.content}
                </div>
              </li>
            ))
          ) : (
            <p className={styles.noComments}>Nenhum comentário ainda.</p>
          )}
        </ul>
      </div>
    </div>
  );
}