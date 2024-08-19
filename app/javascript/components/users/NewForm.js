import React, { useCallback, useMemo, useState } from "react"
import { Button, FormControl, MenuItem, Select, TextField } from "@mui/material"

const NewForm = (props) => {
  const { companies, company_id } = props
  const token = document.querySelector('meta[name="csrf-token"]').content

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [company, setCompany] = useState(company_id)

  const handleNameChange = useCallback((event) => {
    setName(event.target.value)
  }, [])

  const handleEmailChange = useCallback((event) => {
    setEmail(event.target.value)
  }, [])

  const handleRoleChange = useCallback((event) => {
    setRole(event.target.value)
  }, [])

  const handleCompanyChange = useCallback((event) => {
    setCompany(event.target.value)
  }, [])

  const handleSubmit = useCallback(async () => {
    try {
     const response = await fetch(`/users`,{
        method: "POST",
        headers: {
          "X-CSRF-Token": token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user: {
            name: name,
            email: email,
            role: role,
            company_id: company
          }
        })
      })
      const json = await response.json()

      if(response.status === 201) {
        alert(json.message)
        setName('')
        setEmail('')
        setRole('')
        setCompany(company_id)
      }
      else {
        alert(json.errors)
      }
    }
    catch(error) {
      console.error(error)
    }
  }, [name, email, role, company, token])

  const renderCompanies = useMemo(() => (
    companies.map((company) => (
      <MenuItem key={company.id} value={company.id}>{company.name}</MenuItem>
    ))
  ), [companies])

  return (
    <React.Fragment>
      <h2>Novo Usuário</h2>
      <FormControl fullWidth autoComplete="off">
        <TextField id="outlined-basic" label="Email" sx={{mb: 3}} variant="outlined" required onChange={handleEmailChange} value={email}/>
        <TextField id="outlined-basic" label="Nome" sx={{mb: 3}} variant="outlined" required onChange={handleNameChange} value={name}/>
        <Select id="role-select" value={role} onChange={handleRoleChange} required>
          <MenuItem key='1' value='employee'>Empregado</MenuItem>
          <MenuItem key='2' value='admin'>Admin</MenuItem>
        </Select>
        <Select id="company-select" value={company} onChange={handleCompanyChange} required>
          {renderCompanies}
        </Select>
        <Button variant="outlined" size="medium" onClick={handleSubmit}>Registrar</Button>
      </FormControl>
    </React.Fragment>
  )
}

export default NewForm
