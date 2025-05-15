import React, { useState, useEffect } from 'react';
import styles from '../../styles/PoemForm.module.css';

/**
 * Componente de formulário para criar ou editar poemas.
 * Este componente permite aos usuários inserir ou modificar os detalhes de um poema,
 * incluindo título, texto, autor, URL da imagem e data de publicação.
 */
export default function PoemForm({ initial, onSave, onCancel }) {
  // Define os estados para cada campo do formulário.
  const [title, setTitle] = useState(initial?.title || ''); // Estado para o título do poema.
  const [text, setText] = useState(initial?.text || '');     // Estado para o texto do poema.
  const [author, setAuthor] = useState(initial?.author || ''); // Estado para o autor do poema.
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl || ''); // Estado para a URL da imagem do poema.
  const [postDate, setPostDate] = useState(initial?.postDate || ''); // Estado para a data de publicação do poema.

  // Efeito para inicializar o formulário com os valores de 'initial', se fornecidos.
  useEffect(() => {
    if (initial) {
      // Se um poema inicial for fornecido (para edição), atualiza os estados com os valores do poema.
      setTitle(initial.title);
      setText(initial.text);
      setAuthor(initial.author);
      setImageUrl(initial.imageUrl);
      setPostDate(initial.postDate);
    }
  }, [initial]); // Dependência: 'initial'. O efeito é executado quando 'initial' muda.

  /**
   * Função para lidar com o envio do formulário.
   * Chama a função 'onSave' passada como prop, passando os dados do poema.
   */
  const handleSubmit = (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário (recarregar a página).
    onSave({
      // Chama a função 'onSave' com um objeto contendo os dados do poema.
      id: initial?.id, // Mantém o ID original se estiver editando um poema existente.
      title,           // Inclui o título do poema.
      text,            // Inclui o texto do poema.
      author,          // Inclui o autor do poema.
      imageUrl,        // Inclui a URL da imagem do poema.
      postDate,        // Inclui a data de publicação do poema.
    });
  };

  // Renderiza o formulário.
  return (
  <form onSubmit={handleSubmit} className={styles.form}>
    <div>
      <label htmlFor="title" className={styles.label}>Título:</label><br />
      <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
    </div>
    <div>
      <label htmlFor="text" className={styles.label}>Texto:</label><br />
      <textarea id="text" value={text} onChange={(e) => setText(e.target.value)} required />
    </div>
    <div>
      <label htmlFor="author" className={styles.label}>Autor:</label><br />
      <input type="text" id="author" value={author} onChange={(e) => setAuthor(e.target.value)} required />
    </div>
    <div>
      <label htmlFor="imageUrl" className={styles.label}>URL da Imagem:</label><br />
      <input type="text" id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
    </div>
    <div>
      <label htmlFor="postDate" className={styles.label}>Data (dd/MM/yyyy):</label><br />
      <input type="text" id="postDate" value={postDate} onChange={(e) => setPostDate(e.target.value)} placeholder="12/05/2025" required />
    </div>
    <div className={styles['form-button-group']}>
      <button type="submit" className={styles.formButton}>Salvar</button>
      <button type="button" onClick={onCancel} className={styles.formButton}>Cancelar</button>
    </div>
  </form>
  );
}
