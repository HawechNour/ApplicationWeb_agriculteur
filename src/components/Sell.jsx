import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import { GiSellCard } from "react-icons/gi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../contexts/authContext';
import Loader from './Loader';
import { useNavigate } from 'react-router-dom';

function Sell() {
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    dateOfSale: '',
    productName: '',
    quantity: '',
    factureId: '',
    price: '',
    note: '',
    clientName: '',
    userUID: currentUser.uid
  });

  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch clients
        const clientsQuery = query(collection(firestore, 'clients'), where('userUID', '==', currentUser.uid));
        const clientsSnapshot = await getDocs(clientsQuery);
        const clientsList = clientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Fetch products
        const productsQuery = query(collection(firestore, 'products'), where('userUID', '==', currentUser.uid));
        const productsSnapshot = await getDocs(productsQuery);
        const productsList = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Fetch stocks
        const stocksQuery = query(collection(firestore, 'stocks'), where('userUID', '==', currentUser.uid));
        const stocksSnapshot = await getDocs(stocksQuery);
        const stocksList = stocksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setClients(clientsList);
        setProducts(productsList);
        setStocks(stocksList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data: ', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const selectedProduct = products.find(product => product.productName === formData.productName);
      if (!selectedProduct) {
        toast.error('Selected product not found.');
        return;
      }

      const selectedStock = stocks.find(stock => stock.productName === formData.productName);
      const quantityToSell = parseInt(formData.quantity, 10);
      const stockQuantity = selectedStock ? selectedStock.quantity : 0;

      if (quantityToSell > stockQuantity) {
        toast.error('Quantity to sell exceeds quantity in stock.');
        return;
      }

      if (quantityToSell === stockQuantity) {
        // Delete stock if the quantity to sell equals the stock quantity
        await deleteDoc(doc(firestore, 'stocks', selectedStock.id));
      } else {
        // Update stock quantity
        const updatedQuantity = stockQuantity - quantityToSell;
        await updateDoc(doc(firestore, 'stocks', selectedStock.id), {
          quantity: updatedQuantity
        });
      }

      // Add sale data to Firestore
      const docRef = await addDoc(collection(firestore, 'sales'), {...formData , totalPrice : Number(formData.price)*Number(formData.quantity)});
      console.log('Document written with ID: ', docRef.id , docRef);

      // Check if stock quantity is zero and delete the product
      if (quantityToSell === stockQuantity) {
        const productDoc = products.find(product => product.productName === formData.productName);
        if (productDoc) {
          await deleteDoc(doc(firestore, 'products', productDoc.id));
        }
      }

      // Show toast notification
      toast.success('Sale saved successfully!', {
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
        dateOfSale: '',
        productName: '',
        quantity: '',
        factureId: '',
        price: '',
        note: '',
        clientName: '',
        userUID: currentUser.uid
      });
      navigate("/dashboard/transactions")
    } catch (error) {
      console.error('Error adding document: ', error);
      toast.error('Error saving sale. Please try again later.');
    }
  };

  const uniqueProductNames = [...new Set(products.map(product => product.productName))];

  return (
    <div className='Sell'>
      <div className='sellAddHeader'>
        <GiSellCard /> Sell
      </div>
      {loading ? (
        <Loader/>
      ) : (
        <form onSubmit={handleSubmit} className='SellForm'>
          <div>
            <label>Date of Sale</label>
            <input type="date" placeholder='Type Date of Sale' name="dateOfSale" value={formData.dateOfSale} onChange={handleChange} required />
          </div>

          <div>
            <label>Product Name</label>
            <select name="productName" value={formData.productName} onChange={handleChange} required>
              <option value="">Select Product</option>
              {uniqueProductNames.map((productName, index) => (
                <option key={index} value={productName}>{productName}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Quantity</label>
            <input type="number" placeholder='Type Quantity' name="quantity" value={formData.quantity} onChange={handleChange} required />
          </div>

          <div>
            <label>Facture ID</label>
            <input type="text" placeholder='Type Facture ID' name="factureId" value={formData.factureId} onChange={handleChange} required />
          </div>

          <div>
            <label>Price</label>
            <input type="number" placeholder='Type Price' name="price" value={formData.price} onChange={handleChange} required />
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
            <label>Client Name</label>
            <select name="clientName" value={formData.clientName} onChange={handleChange} required>
              <option value="">Select Client</option>
              {clients.map(client => (
                <option key={client.id} value={client.nom}>{client.nom}</option>
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

export default Sell;
