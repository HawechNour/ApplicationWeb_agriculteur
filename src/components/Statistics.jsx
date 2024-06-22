import React, { useState, useEffect, useRef } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import { useAuth } from '../contexts/authContext';

import Chart from 'chart.js/auto';

import { MdOutlineInsights } from 'react-icons/md';
import { IoHappyOutline , IoSadOutline  } from "react-icons/io5";
import { GiReceiveMoney ,GiPayMoney } from "react-icons/gi";
import { CiBoxes } from "react-icons/ci";
import { Link } from 'react-router-dom';
import Loader from "./Loader"

function Statistics() {
  const { currentUser } = useAuth();
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [productsInStock, setProductsInStock] = useState([]);
  const [hasEventForToday, setHasEventForToday] = useState(false);
  const [todayEvents, settodayEvents] = useState([])
  const [loading, setloading] = useState(true)
  const chartRef = useRef(null);

  useEffect(() => {
    fetchSales();
    fetchPurchases();
    fetchProductsInStock();
    checkForEvents();
    
  }, []);

  useEffect(() => {
    if (productsInStock.length > 0) {
      updateStockChart();
    }
  }, [productsInStock]);

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  const fetchSales = async () => {
    try {
      const salesQuery = query(collection(firestore, 'sales'), where('userUID', '==', currentUser.uid));
      const salesSnapshot = await getDocs(salesQuery);
      let total = 0;
      salesSnapshot.forEach((doc) => {
        const price = parseFloat(doc.data().totalPrice); // Convert price string to number
        if (!isNaN(price)) { // Check if conversion was successful
          total += price;
        }
      });
      setTotalIncome(total);
    } catch (error) {
      console.error('Error fetching sales: ', error);
    }
  };

  const fetchPurchases = async () => {
    try {
      const purchasesQuery = query(collection(firestore, 'purchases'), where('userUID', '==', currentUser.uid));
      const purchasesSnapshot = await getDocs(purchasesQuery);
      let total = 0;
      purchasesSnapshot.forEach((doc) => {
        const price = parseFloat(doc.data().totalPrice); // Convert price string to number
        if (!isNaN(price)) { // Check if conversion was successful
          total += price;
        }
      });
      setTotalExpenses(total);
      setloading(false)
    } catch (error) {
      console.error('Error fetching purchases: ', error);
    }
  };

  const fetchProductsInStock = async () => {
    try {
      const productsQuery = query(collection(firestore, 'movements'), where('user', '==', currentUser.uid));
      const productsSnapshot = await getDocs(productsQuery);
      const productsData = [];
      productsSnapshot.forEach((doc) => {
        productsData.push(doc.data());
      });
      setProductsInStock(productsData);
    } catch (error) {
      console.error('Error fetching products in stock: ', error);
    }
  };

  const checkForEvents = async () => {
    try {
      const eventsQuery = query(collection(firestore, 'events'), where('userUid', '==', currentUser.uid));
      const eventsSnapshot = await getDocs(eventsQuery);
      const today = new Date();
      const todayStr = today.toISOString().substring(0, 10);
      let hasEvent = false;
      eventsSnapshot.forEach((doc) => {
        const eventDate = new Date(doc.data().date.seconds * 1000).toISOString().substring(0, 10);
        
        if (eventDate === todayStr) {
          hasEvent = true;
          settodayEvents(prev => [...prev , doc.data()])
        }
      });
      setHasEventForToday(hasEvent);
    } catch (error) {
      console.error('Error checking events for today: ', error);
    }
  };

  const updateStockChart = () => {
    const labels = productsInStock.map(product => product.product);
    
    const data = productsInStock.map(product => product.quantity);
    const ctx = document.getElementById('stockChart');
    console.log(labels , data);
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Quantity in Stock',
          data: data,
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

  const isWinning = totalIncome > totalExpenses;
  return (
    <div className='statPage'>
      {loading && <Loader></Loader>}
      <h2 className='statTitle'> <MdOutlineInsights />Statistics</h2>

      <div className='FinHolder'>
        
        <div>
          <p>
            <span><GiReceiveMoney></GiReceiveMoney>Total Income</span>
            <span>TND {totalIncome}</span>
            <Link to={"/dashboard/transactions"} >See More</Link>
          </p>
          <p>
            <span><GiPayMoney></GiPayMoney>Total Expenses</span>
            <span> TND {totalExpenses}</span>
            <Link to={"/dashboard/transactions"}>See More</Link>
          </p>
        </div>
        
        <p className={!isWinning && `losing`}>{isWinning ? (<><IoHappyOutline></IoHappyOutline>You are winning !</>) : (<><IoSadOutline></IoSadOutline>You are not winning</>)}</p>
      </div>

      
      <div className='bottomStatsHolder'>
        <div className='stockStatHolder'>
          <h3><CiBoxes></CiBoxes>Stock</h3>
          <div>
            <canvas id="stockChart" width="400" height="400"></canvas>
          </div>
        </div>

        <div className='eventStatHolder'>
          <h3>Events</h3>
          <p>{hasEventForToday ? 'You have an event for today' : 'No event for today'}</p>
          <div className='eventCardsHolder'>
            {todayEvents.map(event=>(<Link to={"/dashboard/calendar"}>{event?.title}</Link>))}
          </div>
        </div>
        </div>
    </div>
  );
}

export default Statistics;
