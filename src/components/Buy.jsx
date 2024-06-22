import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../contexts/authContext';
import { GiSellCard } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';

function Buy() {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    dateOfBuy: '',
    productName: '',
    quantity: '',
    factureId: '',
    price: '',
    note: '',
    providerName: '',
    userUID: currentUser.uid
  });
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        // Fetch providers
        const providersQuery = query(collection(firestore, 'fournisseurs'), where('userUID', '==', currentUser.uid));
        const providersSnapshot = await getDocs(providersQuery);
        const providersList = providersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setProviders(providersList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data: ', error);
        setLoading(false);
      }
    };

    fetchProviders();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!Object.values(formData).every(v => v.length > 0)) {
        throw new Error("Empty Fields");
      }

      // Add data to Firestore
      const docRef = await addDoc(collection(firestore, 'purchases'), {...formData , totalPrice : Number(formData.price)*Number(formData.quantity)});
      console.log('Document written with ID: ', docRef.id);

      // Show toast notification
      toast.success('Purchase saved successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });

      // Reset form fields
      setFormData({
        dateOfBuy: '',
        productName: '',
        quantity: '',
        factureId: '',
        price: '',
        note: '',
        providerName: '',
        userUID: currentUser.uid
      });
      navigate("/dashboard/transactions");
    } catch (error) {
      console.error('Error adding document: ', error);
      toast.error('Error saving purchase. Please try again later.');
    }
  };

  return (
    <div className='Sell'>
      <div className='sellAddHeader'>
        <GiSellCard /> Buy
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className='SellForm'>
          <div>
            <label>Date of Buy</label>
            <input type="date" name="dateOfBuy" value={formData.dateOfBuy} onChange={handleChange} required />
          </div>

          <div>
            <label>Product Name</label>
            <input type="text" name="productName" placeholder='Type Product Name' value={formData.productName} onChange={handleChange} required />
          </div>

          <div>
            <label>Quantity</label>
            <input type="number" name="quantity" placeholder='Type Quantity' value={formData.quantity} onChange={handleChange} required />
          </div>

          <div>
            <label>Facture ID</label>
            <input type="text" name="factureId" placeholder='Type Facture ID' value={formData.factureId} onChange={handleChange} required />
          </div>

          <div>
            <label>Price</label>
            <input type="number" name="price" placeholder='Type Price' value={formData.price} onChange={handleChange} required />
          </div>
          <div>
            <label>Total Price</label>
            <input type="number" name="Totalprice" readOnly value={Number(formData.price)*Number(formData.quantity)} required />
          </div>
          <div>
            <label>Note</label>
            <textarea name="note" placeholder='Type Note' value={formData.note} onChange={handleChange}></textarea>
          </div>

          <div>
            <label>Provider Name</label>
            <select name="providerName" value={formData.providerName} onChange={handleChange} required>
              <option value="">Select Provider</option>
              {providers.map(provider => (
                <option key={provider.id} value={provider.prénom}>{provider.prénom}</option>
              ))}
            </select>
          </div>

          <button type="submit">Submit</button>
        </form>
      )}
      <ToastContainer />
    </div>
  );
}

export default Buy;
