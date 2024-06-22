import React, { useEffect, useState, useRef } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import { BiStats } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";
import { IoMdHelpCircle } from "react-icons/io";
import { MdGppGood } from "react-icons/md";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import Chart from 'chart.js/auto';
import { Link } from 'react-router-dom';
import Loader from "../components/Loader"
const StatsAdmin = () => {
  const [numUsers, setNumUsers] = useState(0);
  const [numPendingRequests, setNumPendingRequests] = useState(0);
  const [bestUser, setBestUser] = useState(null);
  const [bestUsers, setTopFourUsers] = useState([]);
  const chartRef = useRef(null);
  const [loading, setloading] = useState(true)
  useEffect(() => {
    const fetchNumUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(firestore, 'users'));
        setNumUsers(usersSnapshot.size);
      } catch (error) {
        console.error('Error fetching number of users:', error);
      }
    };

    const fetchNumPendingRequests = async () => {
      try {
        const requestsSnapshot = await getDocs(collection(firestore, 'help-requests'));
        const pendingRequests = requestsSnapshot.docs.filter(doc => !doc.data().replied);
        setNumPendingRequests(pendingRequests.length);
      } catch (error) {
        console.error('Error fetching number of pending help requests:', error);
      }
    };

    const fetchBestUser = async () => {
      try {
        const usersQuery = query(collection(firestore, 'users'));
        const usersSnapshot = await getDocs(usersQuery);
        let bestUserIncome = -Infinity;
        let bestUserObj = {};
        for (const doc of usersSnapshot.docs) {
          const user = doc.data();
          const salesQuery = query(collection(firestore, 'sales'), where('userUID', '==', doc.id));
          const purchasesQuery = query(collection(firestore, 'purchases'), where('userUID', '==', doc.id));
          const [salesSnapshot, purchasesSnapshot] = await Promise.all([getDocs(salesQuery), getDocs(purchasesQuery)]);
          let totalSales = 0;
          let totalPurchases = 0;
          salesSnapshot.forEach(saleDoc => {
            const sale = saleDoc.data();
            totalSales += parseFloat(sale.price);
          });
          purchasesSnapshot.forEach(purchaseDoc => {
            const purchase = purchaseDoc.data();
            totalPurchases += parseFloat(purchase.price);
          });
          const income = totalSales - totalPurchases;
          if (income > bestUserIncome) {
            bestUserIncome = income;
            bestUserObj = {
              id: doc.id,
              fullName: user.fullName,
              email: user.email,
              income: income
            };
          }
        }
        setBestUser(bestUserObj);
      } catch (error) {
        console.error('Error fetching best user: ', error);
      }
    };

    const fetchTopFourUsers = async () => {
      try {
        const usersQuery = query(collection(firestore, 'users'));
        const usersSnapshot = await getDocs(usersQuery);
        let topFourUsers = [];
        const usersData = [];
        for (const doc of usersSnapshot.docs) {
          const user = doc.data();
          const salesQuery = query(collection(firestore, 'sales'), where('userUID', '==', doc.id));
          const purchasesQuery = query(collection(firestore, 'purchases'), where('userUID', '==', doc.id));
          const [salesSnapshot, purchasesSnapshot] = await Promise.all([getDocs(salesQuery), getDocs(purchasesQuery)]);
          let totalSales = 0;
          let totalPurchases = 0;
          salesSnapshot.forEach(saleDoc => {
            const sale = saleDoc.data();
            totalSales += parseFloat(sale.price);
          });
          purchasesSnapshot.forEach(purchaseDoc => {
            const purchase = purchaseDoc.data();
            totalPurchases += parseFloat(purchase.price);
          });
          const income = totalSales - totalPurchases;
          usersData.push({
            id: doc.id,
            fullName: user.fullName,
            email: user.email,
            income: income
          });
        }
        usersData.sort((a, b) => b.income - a.income);
        topFourUsers = usersData.slice(0, 4);
        setTopFourUsers(topFourUsers);
      } catch (error) {
        console.error('Error fetching top four users: ', error);
      }
      setloading(false)
    };

    fetchNumUsers();
    fetchNumPendingRequests();
    fetchBestUser();
    fetchTopFourUsers();
  }, []);

  useEffect(() => {
    if (bestUsers.length > 0) {
      renderChart();
    }
  }, [bestUsers]);

  const renderChart = () => {
    const labels = bestUsers.map(user => user.fullName);
    const incomes = bestUsers.map(user => user.income);
    const ctx = document.getElementById('incomeChart');
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Income',
          data: incomes,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  };

  return (
    <div className="stats-admin">
      {loading && <Loader/>}
      <h2> <BiStats/> Admin Statistics </h2>
      <div className="cards-container">
        <div className="card">
          <h3><FaUsers/>Number of Users</h3>
          <p>{numUsers}</p>
          <Link to={"/owner/users"}>See More</Link>
        </div>
        <div className="card">
          <h3><IoMdHelpCircle/>Number of Pending Help Requests</h3>
          <p>{numPendingRequests}</p>
          <Link to={"/owner/requests"}>See More</Link>
        </div>
        {bestUser && (
          <div className="card">
            <h3><MdGppGood/>Best User (Based on Income)</h3>
            <p>{bestUser.fullName}</p>
            <span><FaMoneyBillTrendUp/>Total Income: {bestUser.income}</span>
          </div>
        )}
      </div>
      <div className="chart-container">
        <h4>Best 4 Users (Based on Income)</h4>
        <canvas id="incomeChart"></canvas>
      </div>
    </div>
  );
};

export default StatsAdmin;
