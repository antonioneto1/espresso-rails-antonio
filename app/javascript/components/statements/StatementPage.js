import React, { useCallback, useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import List from "./List"; // Importando o componente correto

const StatementPage = ({ user, statements = [] }) => {
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

  const columns = [
    { id: 'merchant', label: 'Estabelecimento' },
    { id: 'cost', label: 'Valor', format: /^(.*)(\d{2})$/, mask: "R$ $1,$2" },
    { id: 'performed_at', label: 'Data de Criação' },
    { id: 'category_id', label: 'Categoria' }
  ];

  return (
    <Box sx={{ p: 3, position: 'relative', minHeight: '100vh', maxWidth: '1200px', margin: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Despesas</Typography>
      <List
        statements={statements}
        columns={columns}
        user={user}
        handleArchive={handleArchive}
        handleEdit={handleEdit}
        categories={categories} // Passando as categorias para o List
      />
    </Box>
  );
};

export default StatementPage;
