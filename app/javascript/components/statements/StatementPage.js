import React, { useCallback, useMemo, useState, useEffect } from "react";
import List from "./List"; // Importando o componente correto

const StatementPage = ({ user, completed_statements = [], open_statements = [] }) => {
  const [view, setView] = useState(user.role === 'admin' ? 'lista' : 'comprovadas'); // Estado para controlar a visualização
  const [categories, setCategories] = useState([]);

  const token = document.querySelector('meta[name="csrf-token"]').content;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`/companies/${user.company_id}/categories`);
        const json = await response.json();
        setCategories(json.categories || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, [user.company_id]);

  const handleArchive = useCallback(async (id) => {
    try {
      const response = await fetch(`/statements/${id}`, {
        method: "PATCH",
        headers: {
          "X-CSRF-Token": token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ statement: { archived: true } })
      });

      const json = await response.json();

      if (response.status === 200) {
        alert(json.message);
        window.location.reload();
      } else {
        alert(json.errors);
      }
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  const handleEdit = useCallback(async (id, category, file) => {
    const formData = new FormData();
    formData.append('category_id', category);
    if (file) formData.append('file', file);

    try {
      const response = await fetch(`/statements/${id}`, {
        method: "PATCH",
        headers: { "X-CSRF-Token": token },
        body: formData
      });

      const json = await response.json();

      if (response.status === 200) {
        alert('Despesa atualizada com sucesso');
        window.location.reload();
      } else {
        alert('Tente novamente mais tarde');
      }
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  const columns = useMemo(() => [
    { id: 'merchant', label: 'Estabelecimento' },
    { id: 'cost', label: 'Valor', format: /^(.*)(\d{2})$/, mask: "R$ $1,$2" },
    { id: 'performed_at', label: 'Data de Criação' },
    { id: 'category_id', label: 'Categoria' }
  ], []);

  const renderContent = () => (
    <React.Fragment>
      <h2>Despesas</h2>
      <div style={{ marginBottom: '16px' }}>
        {user.role === 'admin' && (
          <>
            <button style={buttonStyle} onClick={() => setView('lista')}>Lista</button>
            <button style={buttonStyle} onClick={() => setView('arquivadas')}>Arquivadas</button>
          </>
        )}
        {user.role === 'employee' && (
          <>
            <button style={buttonStyle} onClick={() => setView('comprovadas')}>Comprovadas</button>
            <button style={buttonStyle} onClick={() => setView('nao_comprovadas')}>Não Comprovadas</button>
          </>
        )}
      </div>
      <List
        statements={user.role === 'admin' ? (view === 'lista' ? open_statements : completed_statements) : (view === 'comprovadas' ? completed_statements : open_statements)}
        columns={columns}
        user={user}
        handleArchive={handleArchive}
        handleEdit={handleEdit}
        categories={categories} // Passando as categorias para o List
      />
    </React.Fragment>
  );

  const buttonStyle = {
    marginRight: '16px',
    padding: '8px 16px',
    backgroundColor: '#f0f0f0', // Cor de fundo do botão
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Leve sombreamento
    cursor: 'pointer',
    fontSize: '14px',
    color: '#007bff', // Cor do texto azul
    textDecoration: 'none'
  };

  return (
    <div style={{ maxWidth: '1200px', margin: 'auto' }}>
      {renderContent()}
    </div>
  );
};

export default StatementPage;
