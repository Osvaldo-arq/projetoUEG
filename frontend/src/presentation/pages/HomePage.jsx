import React, { useState } from 'react';
import Navbar from '../components/Navbar'; // Importa o componente Navbar
import styles from '../../styles/HomePage.module.css'; // Importa os estilos CSS do componente
import LoginForm from '../components/LoginForm'; // Importa o componente LoginForm
import RegisterForm from '../components/RegisterForm'; // Importa o componente RegisterForm

/**
 * Componente HomePage:
 *
 * Este componente representa a página inicial da aplicação.
 * Ele renderiza diferentes seções da página com base no estado 'view'.
 */
const HomePage = () => {
  const [view, setView] = useState('home'); // Estado para controlar qual seção da página está sendo exibida ('home', 'login', 'register')

  // Função para renderizar o conteúdo principal da página com base no estado 'view'
  const renderContent = () => {
    switch (view) {
      case 'login':
        return <LoginForm />; // Renderiza o formulário de login
      case 'register':
        return <RegisterForm onSuccess={() => setView('login')} />; // Renderiza o formulário de registro e define a view para 'login' após o sucesso
      default:
        // Renderiza a seção principal da página inicial
        return (
          <section className={styles.main}>
            <h1>Bem-vindo ao App</h1>
            <p>Explore, comente e curta belos poemas compartilhados por nossa comunidade.</p>
            <a href="/poems" className={styles.button}>Ver Poemas</a>
          </section>
        );
    }
  };

  // Renderiza a página inicial, incluindo a barra de navegação e o conteúdo principal
  return (
    <>
      <Navbar onChangeView={setView} /> {/* Renderiza a barra de navegação e passa a função setView para permitir a troca de seção */}
      {renderContent()}        {/* Renderiza o conteúdo principal da página */}
    </>
  );
};

export default HomePage; // Exporta o componente HomePage para ser utilizado em outros lugares da aplicação
