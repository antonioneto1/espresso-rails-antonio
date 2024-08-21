import React, { useCallback, useMemo, useState } from "react";
import StatementList from "./List";

const StatementPage = ({ user, open_statements }) => {
  const [view, setView] = useState('lista'); // Estado para controlar a visualização

  const token = document.querySelector('meta[name="csrf-token"]').content;

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

  const handleAttach = useCallback(async (event, id) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`/statements/${id}/attach_invoice.json`, {
        method: "PATCH",
        headers: { "X-CSRF-Token": token },
        body: formData
      });

      if (response.status === 200) {
        alert('Anexado com sucesso');
        window.location.reload();
      } else {
        alert('Tente novamente mais tarde');
      }
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  const handleSetCategory = useCallback((id) => {
    window.location.href = `/statements/${id}/edit`;
  }, []);

  const columns = useMemo(() => [
    { id: 'merchant', label: 'Estabelecimento' },
    { id: 'cost', label: 'Valor', format: /^(.*)(\d{2})$/, mask: "R$ $1,$2" },
    { id: 'performed_at', label: 'Data de Criação' },
    { id: 'card', label: 'Cartão' },
    { id: 'invoice', label: 'Comprovante' },
    { id: 'employee', label: 'Funcionário' },
    { id: 'category', label: 'Categoria' }
  ], []);

  const renderContent = () => (
    <React.Fragment>
      <h2>Despesas</h2>
      <div style={{ marginBottom: '16px' }}>
        <button style={buttonStyle} onClick={() => setView('lista')}>Lista</button>
        <button style={buttonStyle} onClick={() => setView('arquivadas')}>Arquivadas</button>
      </div>
      <StatementList
        statements={open_statements}
        columns={columns}
        user={user}
        handleArchive={handleArchive}
        handleAttach={handleAttach}
        handleSetCategory={handleSetCategory}
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
