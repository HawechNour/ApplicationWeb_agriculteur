import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import { useAuth } from '../contexts/authContext';
import { IoCubeOutline } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io"; 
import Loader from './Loader';

function Stock() {
    const { currentUser } = useAuth();
    const [stocks, setStocks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('productName'); // Default filter type
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStocks = async () => {
            if (currentUser) {
                const q = query(collection(firestore, 'stocks'), where('userUID', '==', currentUser.uid));
                const querySnapshot = await getDocs(q);
                const stocksData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setStocks(stocksData);
                setLoading(false);
            }
        };
        fetchStocks();
    }, [currentUser]);

    const handleFilterChange = (e) => {
        setFilterType(e.target.value);
    };

    const filteredStocks = stocks.filter(stock =>
        stock[filterType]?.toLowerCase().includes(searchTerm?.toLowerCase())
    );

    return (
        <div className='Stock'>
            {loading && <Loader />}
            <span className='shades' id='shade1'></span>

            <div className='StockHeader'>
                <div>
                    <IoCubeOutline /> Stock
                </div>
                
            </div>

            <div className='StockHolder'>
                {/* <div className="filterOptions">
                    <label>
                        <input
                            type="radio"
                            value="productName"
                            checked={filterType === 'productName'}
                            onChange={handleFilterChange}
                        />
                        Product Name
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="date"
                            checked={filterType === 'date'}
                            onChange={handleFilterChange}
                        />
                        Date
                    </label>

                </div> */}
                <div className='searchBarHolderInStock'>
                    <input
                        placeholder={`Search by ${filterType}`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <label><FaSearch /></label>
                </div>

                <table>
                    <thead>
                        <tr>

                            <th>Product Name</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStocks.map(stock => (
                            <tr key={stock.id}>

                                <td>{stock.productName}</td>
                                <td>{stock.quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Stock;
