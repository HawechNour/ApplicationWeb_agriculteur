import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import { useAuth } from '../contexts/authContext';
import { IoCubeOutline } from 'react-icons/io5';


function AddToStock() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        date: '',
        product: '',
        price: '',
        quantity: '',
        factureNumber: '',
        note: '',
        providerName : '',
        providerContact : ''
    });
    const [Tprice, setTprice] = useState(0)
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        if (id=="price" || id=="quantity") {
            console.log(document.getElementById("price").value * document.getElementById("quantity").value);
            setTprice(document.getElementById("price").value * document.getElementById("quantity").value)
        }
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }))
    };

    const addToStock = async () => {
        try {
            if (!Object.values(formData).every(v => v.length > 0)) {
               throw "Empty Fileds" 
            }
            const movementRef = collection(firestore, 'movements');
            await addDoc(movementRef, {
                date: formData.date,
                product: formData.product,
                price: formData.price,
                quantity: formData.quantity,
                Tprice : Tprice,
                factureNumber: formData.factureNumber,
                note: formData.note,
                user: currentUser.uid,
                providerName : formData.providerName,
                providerContact : formData.providerContact
            });

            toast.success('Added to stock successfully');
            navigate("/dashboard/stock")
        } catch (error) {
            console.error('Error adding to stock: ', error);
            toast.error('Failed to add to stock');
        }
    };

    return (
        <div className='AddToStock'>
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

            <div className='stockAddHeader'>
                <IoCubeOutline/> Stock
            </div>
            
            <div className="addToStockForm">
                <div>
                    <label htmlFor="date">Date</label>
                    <input type="date" id="date" placeholder='Date' value={formData.date} onChange={handleInputChange} />
                </div>
                <div>
                    <label htmlFor="product">Product</label>
                    <input type="text" id="product" placeholder='Type Product' value={formData.product} onChange={handleInputChange} />
                </div>
                <div>
                    <label htmlFor="price">Price</label>
                    <input type="number" id="price" placeholder='Type Price' value={formData.price} onChange={handleInputChange} />
                </div>
                <div>
                    <label htmlFor="price">Total Price</label>
                    <input type="number" dis id="Tprice" placeholder='Type Price' value={Tprice} onChange={handleInputChange} />
                </div>
                <div>
                    <label htmlFor="quantity">Quantity</label>
                    <input type="number" id="quantity" placeholder='Type Quantity' value={formData.quantity} onChange={handleInputChange} />
                </div>
                <div>
                    <label htmlFor="providerName">Provider Name</label>
                    <input type="text" id="providerName" placeholder='Type Provider Name' value={formData.providerName} onChange={handleInputChange} />
                </div>
                <div>
                    <label htmlFor="providerContact">Provider Contact</label>
                    <input type="text" id="providerContact" placeholder='Type Provider Contact' value={formData.providerContact} onChange={handleInputChange} />
                </div>
                <div>
                    <label htmlFor="note">Note</label>
                    <textarea id="note" value={formData.note} placeholder='Type Note' onChange={handleInputChange}></textarea>
                </div>
            </div>
            <div className='navigationFromAddToStock'>
                <Link to="/dashboard/stock">cancel</Link>
            <button onClick={addToStock}>Save</button>
            </div>
        </div>
    )
}

export default AddToStock;