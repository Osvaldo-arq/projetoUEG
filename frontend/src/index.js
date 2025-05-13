import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; // Importa o componente principal da aplicação.
import './styles/global.css'; // Importa os estilos globais da aplicação.

// Obtém o elemento do DOM onde a aplicação será renderizada.
const container = document.getElementById('root');
// Cria uma raiz do React para renderizar o componente dentro do container.
const root = createRoot(container);
// Renderiza o componente <App /> dentro da raiz do React.
root.render(<App />);
