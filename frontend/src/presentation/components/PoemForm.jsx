import React, { useState, useEffect } from 'react';

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
    <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
      {/* Aplica estilos de borda, preenchimento e margem inferior ao formulário. */}
      <div>
        <label>Título:</label><br />
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        {/* Campo de entrada para o título do poema.  'required' garante que o campo seja preenchido. */}
      </div>
      <div>
        <label>Texto:</label><br />
        <textarea value={text} onChange={(e) => setText(e.target.value)} required />
        {/* Área de texto para o texto do poema. 'required' garante que o campo seja preenchido. */}
      </div>
      <div>
        <label>Autor:</label><br />
        <input value={author} onChange={(e) => setAuthor(e.target.value)} required />
        {/* Campo de entrada para o autor do poema. 'required' garante que o campo seja preenchido. */}
      </div>
      <div>
        <label>URL da Imagem:</label><br />
        <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        {/* Campo de entrada para a URL da imagem do poema. */}
      </div>
      <div>
        <label>Data (dd/MM/yyyy):</label><br />
        <input value={postDate} onChange={(e) => setPostDate(e.target.value)} placeholder="12/05/2025" required />
        {/* Campo de entrada para a data de publicação do poema. 'required' garante que o campo seja preenchido. */}
      </div>
      <button type="submit">Salvar</button>
      {/* Botão para enviar o formulário. */}
      <button type="button" onClick={onCancel} style={{ marginLeft: '1rem' }}>Cancelar</button>
      {/* Botão para cancelar a operação. 'onClick' chama a função 'onCancel' passada como prop. */}
    </form>
  );
}
