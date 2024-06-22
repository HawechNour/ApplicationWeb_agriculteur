import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import { useAuth } from '../contexts/authContext';
import { IoCubeOutline } from 'react-icons/io5';
function AddToClient() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nom: '',
        contact: '',
        adresse: '',
        userUID : currentUser.uid
    });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const addToClient = async () => {
        try {
            if (!Object.values(formData).every(v => v.length > 0)) {
                throw "Empty Fileds" 
             }
            const clientRef = collection(firestore, 'clients');
            
            await addDoc(clientRef, {
                nom: formData.nom,
                contact: formData.contact,
                adresse: formData.adresse,
                userUID: currentUser.uid,
                
            });

            toast.success('Added to client successfully');
            navigate("/dashboard/Client")
        } catch (error) {
            console.error('Error adding to client: ', error);
            toast.error('Failed to add to client');
        }
    };

    return (
        <div className='AddToClient'>
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

            <div className='clientAddHeader'>
                <IoCubeOutline/> Client
            </div>
            
            <div className="addToClientForm">
            <div>
                    <label htmlFor="nom">Nom</label>
                    <input type="text" id="nom" placeholder='Type Nom' value={formData.nom} onChange={handleInputChange} />
                </div>
                <div>
                    <label htmlFor="contact">Contact</label>
                    <input type="number" id="contact" placeholder='Type Contact' value={formData.contact} onChange={handleInputChange} />
                </div>
                <div>
                    <label htmlFor="adresse">Adresse</label>
                    <input type="text" id="adresse" placeholder='adresse' value={formData.adresse} onChange={handleInputChange} />
                </div>
                
                </div>
               
                
            <div className='navigationFromAddToClient'>
                <Link to="/dashboard/client">cancel</Link>
            <button onClick={addToClient}>Save</button>
            </div>
        </div>
    )
}

export default AddToClient;