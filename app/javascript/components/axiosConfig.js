// app/javascript/components/axiosConfig.js
import axios from 'axios';

// Obtém o token CSRF do meta tag no documento
const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

// Configura o Axios para incluir o token CSRF em todas as requisições
axios.defaults.headers.common['X-CSRF-Token'] = token;
