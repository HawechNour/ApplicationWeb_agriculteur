import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import { useAuth } from '../contexts/authContext';
import { IoCubeOutline } from 'react-icons/io5';


function AddToFournisseur() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        prénom: '',
        nomdefamille: '',
        numérodetéléphone: '',
        adresse: '',
        fax: '',
        email: '',
        uRLFacebook: '',
        userUID : currentUser.uid
    });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const addToFournisseur = async () => {
        try {
            if (!Object.values(formData).every(v => v.length > 0)) {
                throw "Empty Fileds" 
             }
            const fournisseurRef = collection(firestore, 'fournisseurs');
            await addDoc(fournisseurRef, {
                prénom: formData.prénom,
                nomdefamille: formData.nomdefamille,
                numérodetéléphone: formData.numérodetéléphone,
                adresse: formData.adresse,
                fax: formData.fax,
                email: formData.email,
                userUID: currentUser.uid,
                uRLFacebook : formData.uRLFacebook
            });

            toast.success('Added to fournisseur successfully');
            navigate("/dashboard/fournisseur")
        } catch (error) {
            console.error('Error adding to fournisseur: ', error);
            toast.error('Failed to add to fournisseur');
        }
    };
    return (
        <div className='AddToFournisseur'>
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

            <div className='fournisseurAddHeader'>
                <IoCubeOutline/> Fournisseur
            </div>
            
            <div className="addToFournisseurForm">
                <div>
                    <label htmlFor="prénom">Prénom</label>
                    <input type="text" id="prénom" placeholder='prénom' value={formData.prénom} onChange={handleInputChange} />
                </div>
                <div>
                    <label htmlFor="nomdefamille">Nom de famille</label>
                    <input type="text" id="nomdefamille" placeholder='Type Nom de famille' value={formData.nomdefamille} onChange={handleInputChange} />
                </div>
                <div>
                    <label htmlFor="numérodetéléphone">Numéro de téléphone</label>
                    <input type="number" id="numérodetéléphone" placeholder='Type Numéro de téléphone' value={formData.numérodetéléphone} onChange={handleInputChange} />
                </div>
                <div>
                    <label htmlFor="adresse">Adresse</label>
                    <input type="text" id="adresse" placeholder='Type Adresse' value={formData.adresse} onChange={handleInputChange} />
                </div>
                <div>
                    <label htmlFor="fax">Fax</label>
                    <input type="number" id="fax" placeholder='Type Fax' value={formData.fax} onChange={handleInputChange} />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="text" id="email" placeholder='Type Email' value={formData.email} onChange={handleInputChange} />
                </div>
                <div>
                    <label htmlFor="uRLFacebook">URL Facebook</label>
                    <textarea id="uRLFacebook" value={formData.uRLFacebook} placeholder='Type URL Facebook' onChange={handleInputChange}></textarea>
                </div>
            </div>
            <div className='navigationFromAddToFournisseur'>
                <Link to="/dashboard/fournisseur">cancel</Link>
            <button onClick={addToFournisseur}>Save</button>
            </div>
        </div>
    )
}

export default AddToFournisseur;