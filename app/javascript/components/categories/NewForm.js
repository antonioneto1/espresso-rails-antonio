import React, { useCallback, useState } from "react"
import { Button, FormControl, TextField } from "@mui/material"

const NewForm = (props) => {
  const { company_id } = props
  const [name, setName] = useState('')
  const token = document.querySelector('meta[name="csrf-token"]').content

  const handleNameChange = useCallback((event) => {
    setName(event.target.value)
  }, [])

  const handleSubmit = useCallback(async () => {
    try {
     const response = await fetch(`/companies/${company_id}/categories`,{
        method: "POST",
        headers: {
          "X-CSRF-Token": token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          category: { name: name }
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
  }, [name, company_id, token])

  return (
    <React.Fragment>
      <h2>Nova Categoria</h2>
      <FormControl fullWidth autoComplete="off">
        <TextField id="outlined-basic" label="Nome" sx={{mb: 3}} fullWidth variant="outlined" required onChange={handleNameChange} value={name}/>
        <Button variant="outlined" size="medium" type="submit" onClick={handleSubmit}>Registrar</Button>
      </FormControl>
    </React.Fragment>
  )
}

export default NewForm
