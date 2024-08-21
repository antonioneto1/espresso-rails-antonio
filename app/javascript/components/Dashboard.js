import React, { useState } from 'react';
import Header from './Header';


const Dashboard = ({ user, company }) => {
  const [selectedOption, setSelectedOption] = useState('Despesas');

  const handleMenuItemClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <div>
      <Header user={user} company={company} onLogout={() => console.log('Logout')} />
    </div>
  );
};

export default Dashboard;
