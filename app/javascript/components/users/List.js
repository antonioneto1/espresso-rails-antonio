import React from "react";
import CustomTable from "../CustomTable";

const columns = [
  { id: 'id', label: 'ID', minWidth: 170 },
  { id: 'name', label: 'Nome', minWidth: 170 },
  { id: 'email', label: 'E-mail', minWidth: 100 },
  {
    id: 'role',
    label: 'Perfil',
    minWidth: 170,
    align: 'center'
  }
];

const List = (props) => {
  const { users } = props

  return(
    <React.Fragment>
      <CustomTable title='Usuários' columns={columns} rows={users} />
    </React.Fragment>
  )
}

export default List