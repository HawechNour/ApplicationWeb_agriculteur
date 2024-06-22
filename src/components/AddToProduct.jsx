import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { collection, addDoc, query, where, getDocs, updateDoc, increment } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import { useAuth } from '../contexts/authContext';
import { IoCubeOutline } from 'react-icons/io5';

function AddToProduct() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productName: '',
    quantityInStock: 0
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const addToProduct = async () => {
    try {
      // Check if all form fields are filled
      if (!Object.values(formData).every(v => v.length > 0)) {
        throw "Empty Fields";
      }

      // Reference to the products collection
      const productRef = collection(firestore, 'products');
      
      // Add the new product document to the products collection
      await addDoc(productRef, {
        productName: formData.productName,
        quantityInStock: Number(formData.quantityInStock),
        userUID: currentUser.uid,
      });

      // Reference to the stocks collection
      const stockRef = collection(firestore, 'stocks');
      
      // Query to check if a stock document with the same productName and userUID exists
      const stockQuery = query(stockRef, where('productName', '==', formData.productName), where('userUID', '==', currentUser.uid));
      const querySnapshot = await getDocs(stockQuery);

      if (querySnapshot.empty) {
        // If no such document exists, create a new one
        await addDoc(stockRef, {
          productName: formData.productName,
          quantity: Number(formData.quantityInStock),
          userUID: currentUser.uid
        });
      } else {
        // If a document exists, update the quantity
        querySnapshot.forEach(async (doc) => {
          const stockDocRef = doc.ref;
          await updateDoc(stockDocRef, {
            quantity: increment(Number(formData.quantityInStock))
          });
        });
      }

      // Show success message
      toast.success('Added to Product successfully');
      navigate("/dashboard/Product");
    } catch (error) {
      console.error('Error adding to Product: ', error);
      toast.error('Failed to add to Product');
    }
  };

  return (
    <div className='AddToProduct'>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={"Bounce"}
      />
      <span className='shades' id='shade1'></span>
      <span className='shades' id='shade2'></span>

      <div className='productAddHeader'>
        <IoCubeOutline /> Product
      </div>

      <div className="addToProductForm">
        <div>
          <label htmlFor="productName">Product Name</label>
          <input type="text" id="productName" placeholder='Type product Name' value={formData.productName} onChange={handleInputChange} />
        </div>
        <div>
          <label htmlFor="quantityInStock">Quantity In Stock</label>
          <input type="number" id="quantityInStock" placeholder='Type Quantity In Stock' value={formData.quantityInStock} onChange={handleInputChange} />
        </div>
      </div>

      <div className='navigationFromAddToProduct'>
        <Link to="/dashboard/product">Cancel</Link>
        <button onClick={addToProduct}>Save</button>
      </div>
    </div>
  );
}

export default AddToProduct;
