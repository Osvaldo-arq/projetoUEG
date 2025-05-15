import React, { useState, useEffect } from 'react';

/**
 * ProfileForm Component:
 *
 * Este componente renderiza um formulário para criar ou editar informações de perfil de usuário. Ele recebe
 * dados de perfil iniciais como uma prop e fornece campos de entrada para nome, sobrenome, telefone
 * e email do usuário. Ele usa o estado para gerenciar os valores do formulário e chama funções de callback
 * para salvar ou cancelar o envio do formulário.
 */
export default function ProfileForm({ profile, onSubmit, onCancel }) {
  // Declara variáveis de estado para cada campo do formulário, inicializadas com strings vazias.
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [userEmail, setUserEmail] = useState('');

  /**
   * useEffect Hook:
   *
   * Este hook é responsável por atualizar o estado do formulário quando a prop 'profile' muda.
   * Se um objeto 'profile' é passado para o componente (significando que estamos editando um perfil existente),
   * o hook atualiza as variáveis de estado correspondentes com os valores do objeto profile.
   *
   * Dependências: [profile] - Este efeito será executado sempre que a prop 'profile' mudar.
   */
  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName);
      setLastName(profile.lastName);
      setPhone(profile.phone);
      setUserEmail(profile.userEmail);
    }
  }, [profile]);

  /**
   * handleSubmit Function:
   *
   * Esta função é chamada quando o formulário é enviado. Ela previne o comportamento padrão de envio do formulário
   * (que causaria um recarregamento da página) e chama a função de callback 'onSubmit'
   * passada como uma prop, fornecendo a ela um objeto contendo os valores atuais do formulário.
   *
   * @param e O objeto de evento de envio.
   */
  const handleSubmit = (e) => {
    e.preventDefault(); // Previne o comportamento padrão de envio do formulário.
    onSubmit({ firstName, lastName, phone, userEmail }); // Chama o callback onSubmit com os dados do formulário.
  };

  // Renderiza o formulário:
  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <div>
        <label>Nome: </label>
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)} // Atualiza o estado firstName quando a entrada muda.
          required // Torna este campo obrigatório.
        />
      </div>
      <div>
        <label>Sobrenome: </label>
        <input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)} // Atualiza o estado lastName quando a entrada muda.
          required // Torna este campo obrigatório.
        />
      </div>
      <div>
        <label>Telefone: </label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)} // Atualiza o estado phone quando a entrada muda.
          required // Torna este campo obrigatório.
        />
      </div>
      <div>
        <label>Email: </label>
        <input
          type="email" // Define o tipo de entrada como email para validação e melhor UI.
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)} // Atualiza o estado userEmail quando a entrada muda.
          required // Torna este campo obrigatório.
        />
      </div>
      {/* Botões para salvar ou cancelar o formulário. */}
      <button type="submit" style={{ marginRight: '0.5rem' }}>
        Salvar
      </button>
      <button type="button" onClick={onCancel}>
        Cancelar
      </button>
    </form>
  );
}
