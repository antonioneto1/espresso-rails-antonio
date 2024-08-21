import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Header'; // Ajuste o caminho conforme necessário

function App() {
  return (
    <Router>
      <Header user={user} company={company} />
      <Routes>
        {/* Defina suas rotas aqui */}
      </Routes>
    </Router>
  );
}

export default App;
