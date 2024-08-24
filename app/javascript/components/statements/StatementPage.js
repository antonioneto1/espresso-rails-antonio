import React, { useCallback, useState, useEffect } from "react";
import { Box, Typography, Tabs, Tab } from "@mui/material";
import List from "./List";

const StatementPage = ({ user, statements = [], completedStatements = [], openStatements = [] }) => {
  const [categories, setCategories] = useState([]);
  const [showArchived, setShowArchived] = useState(false);
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
      const response = await fetch(`/statements/archived/${id}`, {
        method: "POST",
        headers: {
          "X-CSRF-Token": token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ archived: true })
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

  const handleUnarchive = useCallback(async (id) => {
    try {
      const response = await fetch(`/statements/archived/${id}`, {
        method: "POST",
        headers: {
          "X-CSRF-Token": token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ archived: false  })
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

  const handleTabChange = (event, newValue) => {
    setShowArchived(newValue === 1);
  };

  const columns = [
    { id: 'merchant', label: 'Estabelecimento' },
    { id: 'cost', label: 'Valor', format: /^(.*)(\d{2})$/, mask: "R$ $1,$2" },
    { id: 'performed_at', label: 'Data de criação' },
    { id: 'card', label: 'Cartão' },
    { id: 'status', label: 'Comprovação' }
  ];

  const relevantStatements = user?.role === 'admin'
    ? (showArchived ? completedStatements : openStatements)
    : statements;

  return (
    <Box sx={{ p: 3, position: 'relative', minHeight: '100vh', maxWidth: '1200px', margin: 'auto' }}>
    <Typography variant="h4" sx={{ mb: 2 }}>Despesas</Typography>
    {user?.role === 'admin' && (
      <Tabs value={showArchived ? 1 : 0} onChange={handleTabChange} aria-label="abas de despesas">
        <Tab label="Lista" />
        <Tab label="Arquivadas" />
      </Tabs>
    )}
      <List
        statements={relevantStatements}
        completedStatements={completedStatements}
        openStatements={openStatements}
        columns={columns}
        user={user}
        handleArchive={handleArchive}
        handleUnarchive={handleUnarchive}
        handleEdit={handleEdit}
        categories={categories}
      />
    </Box>
  );
};

export default StatementPage;
