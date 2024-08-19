import React, { useCallback, useMemo, useState } from "react"
import { Button, FormControl, MenuItem, Select } from "@mui/material"

const Form = (props) => {
  const { statement, categories } = props
  const [category, setCategory] = useState(statement.category_id)

  const token = document.querySelector('meta[name="csrf-token"]').content

  const handleCategoryChange = useCallback((event) => {
    setCategory(event.target.value)
  }, [])

  const handleSubmit = useCallback(async () => {
    try {
      const response = await fetch(`/statements/${statement.id}`,{
        method: "PATCH",
        headers: {
          "X-CSRF-Token": token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          statement: { category_id: category }
        })
      })
      const json = await response.json()

      if(response.status === 200) {
        alert(json.message)
      }
      else {
        alert(json.errors)
      }
    }
    catch(error) {
      console.error(error)
    }
  }, [category, statement, token])

  const renderCategoryOptions = useMemo(() => (
    categories.map((category) => (
      <MenuItem key={category.id} id={category.id} value={category.id}>{category.name}</MenuItem>
    ))
  ), [categories])

  return (
    <React.Fragment>
      <h2>Despesa {statement.transaction_id}</h2>
      <FormControl fullWidth autoComplete="off">
      <Select labelId="role-label" id="role-select" value={category} onChange={handleCategoryChange}>
          {renderCategoryOptions}
        </Select>
        <Button variant="outlined" size="medium" type="submit" onClick={handleSubmit}>Registrar</Button>
      </FormControl>
    </React.Fragment>
  )
}

export default Form
