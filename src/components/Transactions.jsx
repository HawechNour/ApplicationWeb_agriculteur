import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import { useAuth } from '../contexts/authContext';
import { GrTransaction } from 'react-icons/gr';
import { Link, Outlet } from 'react-router-dom';

function Transactions() {
  const { currentUser } = useAuth();
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    fetchTotalIncome();
    fetchTotalExpenses();
  }, []);

  const fetchTotalIncome = async () => {
    try {
      const salesQuery = query(collection(firestore, 'sales'), where('userUID', '==', currentUser.uid));
      const salesSnapshot = await getDocs(salesQuery);
      let total = 0;
      salesSnapshot.forEach((doc) => {
        total += parseFloat(doc.data().totalPrice);
      });
      setTotalIncome(total);
    } catch (error) {
      console.error('Error fetching total income: ', error);
    }
  };

  const fetchTotalExpenses = async () => {
    try {
      const purchasesQuery = query(collection(firestore, 'purchases'), where('userUID', '==', currentUser.uid));
      const purchasesSnapshot = await getDocs(purchasesQuery);
      let total = 0;
      purchasesSnapshot.forEach((doc) => {
        total += parseFloat(doc.data().totalPrice);
      });
      setTotalExpenses(total);
    } catch (error) {
      console.error('Error fetching total expenses: ', error);
    }
  };

  const totalIncomee = totalIncome - totalExpenses;

  return (
    <div className='Transaction'>
        <div className='TransHeader'>
          {/* <label><GrTransaction /> Transactions</label> */}
          <label>Total income: {totalIncomee}</label>
          <span className='shades' id='shade1'></span>
          <span className='shades' id='shade2'></span>
          <div className='transactionsHeader'>
              
              <Link to="/dashboard/transactions/buy">Buy</Link>
              <Link to="/dashboard/transactions/sell">Sell</Link>
              <Link to="/dashboard/transactions/history">History</Link>
          </div>
        </div>
        <Outlet/>
    </div>
  );
}

export default Transactions;
