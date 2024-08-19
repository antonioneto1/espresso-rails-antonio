import React, { useCallback, useState } from "react"
import { Button, FormControl, TextField } from "@mui/material"

const NewForm = () => {
  const [name, setName] = useState('')
  const [cnpj, setCnpj] = useState('')
  const token = document.querySelector('meta[name="csrf-token"]').content

  const handleNameChange = useCallback((event) => {
    setName(event.target.value)
  }, [])

  const handleCnpjChange = useCallback((event) => {
    setCnpj(event.target.value)
  }, [])

  const handleSubmit = useCallback(async () => {
    try {
     const response = await fetch("/companies", {
        method: "POST",
        headers: {
          "X-CSRF-Token": token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          company: { name: name, cnpj: cnpj }
        })
      })
      const json = await response.json()

      if(response.status === 201) {
        alert(json.message)
        setCnpj('')
        setName('')
      }
      else {
        alert(json.errors)
      }
    }
    catch(error) {
      console.error(error)
    }
  }, [name, cnpj, token])

  return (
    <React.Fragment>
      <h2>Nova Companhia</h2>
      <FormControl fullWidth autoComplete="off">
        <TextField id="outlined-basic" label="Nome" sx={{mb: 3}} fullWidth variant="outlined" required onChange={handleNameChange} value={name}/>
        <TextField id="outlined-basic" label="CNPJ" sx={{mb: 3}} fullWidth variant="outlined" required onChange={handleCnpjChange} value={cnpj}/>
        <Button variant="outlined" size="medium" onClick={handleSubmit}>Registrar</Button>
      </FormControl>
    </React.Fragment>
  )
}

export default NewForm
