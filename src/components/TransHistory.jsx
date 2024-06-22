import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, where, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import { useAuth } from '../contexts/authContext';
import Loader from './Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function History() {
  const { currentUser } = useAuth();
  const [type, setType] = useState('sales'); // 'sales' or 'purchases'
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState('productName');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [type]);

  const fetchData = async () => {
    try {
      const q = query(collection(firestore, type), where('userUID', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      const newData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data(), isEditing: false }));
      setData(newData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  const handleTypeChange = (newType) => {
    setType(newType);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterOption(e.target.value);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(firestore, type, id));
      setData((prevData) => prevData.filter((item) => item.id !== id));
      toast.success('Document deleted successfully');
    } catch (error) {
      console.error('Error deleting document: ', error);
      toast.error('Error deleting document');
    }
  };

  const handleEdit = (id) => {
    setData((prevData) =>
      prevData.map((item) => (item.id === id ? { ...item, isEditing: true } : item))
    );
  };

  const handleSave = async (id, newData) => {
    try {
      await updateDoc(doc(firestore, type, id), newData);
      setData((prevData) =>
        prevData.map((item) =>
          item.id === id ? { ...item, ...newData, isEditing: false } : item
        )
      );
      toast.success('Document updated successfully');
    } catch (error) {
      console.error('Error updating document: ', error);
      toast.error('Error updating document');
    }
  };

  const handleInputChange = (e, id, field) => {
    const { value } = e.target;
    setData((prevData) =>
      prevData.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const filteredData = data.filter((item) =>
    item[filterOption].toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='TransHistory'>
      {loading && <Loader />}
      <ToastContainer />

      <div className='TransHistoryHeader'>
        <div className="TransHistoryTableChanger">
            <button onClick={() => handleTypeChange('sales')} className={type === "sales" ? "activeType" :""}>Sales</button>
            <button onClick={() => handleTypeChange('purchases')} className={type === "purchases" ? "activeType" :""}>Purchases</button>
        </div>
        <div className='SearchContaciner'>
            <input type="text" placeholder="Search..." onChange={handleSearch} />
            <select value={filterOption} onChange={handleFilterChange}>
                <option value="productName">Product Name</option>
                <option value="quantity">Quantity</option>
                <option value="factureId">Facture ID</option>
                <option value="price">Price</option>
                <option value="note">Note</option>
                <option value={type === 'sales' ? 'clientName' : 'providerName'}>
                    {type === 'sales' ? 'Client Name' : 'Provider Name'}
                </option>
            </select>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Facture ID</th>
            <th>Price</th>
            <th>Total Price</th>
            <th>Note</th>
            <th>{type === 'sales' ? 'Client' : 'Provider'}</th>
            <th style={{textAlign : "center"}}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.id}>
              <td>{item.dateOfSale || item.dateOfBuy}</td>
              <td>
                {item.isEditing ? (
                  <input
                    type="text"
                    value={item.productName}
                    onChange={(e) => handleInputChange(e, item.id, 'productName')}
                  />
                ) : (
                  item.productName
                )}
              </td>
              <td>
                {item.isEditing ? (
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleInputChange(e, item.id, 'quantity')}
                  />
                ) : (
                  item.quantity
                )}
              </td>
              <td>
                {item.isEditing ? (
                  <input
                    type="text"
                    value={item.factureId}
                    onChange={(e) => handleInputChange(e, item.id, 'factureId')}
                  />
                ) : (
                  item.factureId
                )}
              </td>
              <td>
                {item.isEditing ? (
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => handleInputChange(e, item.id, 'price')}
                  />
                ) : (
                  item.price
                )}
              </td>
              <td>
                {item.isEditing ? (
                  <input
                    type="number"
                    value={item.totalPrice}
                    onChange={(e) => handleInputChange(e, item.id, 'totalPrice')}
                  />
                ) : (
                  item.totalPrice
                )}
              </td>
              <td>
                {item.isEditing ? (
                  <input
                    type="text"
                    value={item.note}
                    onChange={(e) => handleInputChange(e, item.id, 'note')}
                  />
                ) : (
                  item.note
                )}
              </td>
              <td>{type === 'sales' ? item.clientName : item.providerName}</td>
              <td style={{display : "flex" , justifyContent : 'center'}}>
                {item.isEditing ? (
                  <button onClick={() => handleSave(item.id, item)}>Save</button>
                ) : (
                  <>
                    <button onClick={() => handleDelete(item.id)} style={{backgroundColor : '#DC3545',color : "white"}}>Delete</button>
                    <button onClick={() => handleEdit(item.id)}>Update</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default History;
