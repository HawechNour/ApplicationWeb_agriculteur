import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import { useAuth } from '../contexts/authContext';
import { IoCubeOutline } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";
import Loader from './Loader';
function Fournisseur() {
    const { currentUser } = useAuth();
    const [fournisseurs, setFournisseurs] = useState([]);
    const [editedFournisseur, setEditedFournisseur] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('prénom'); // Default filter type
    const [loading, setloading] = useState(true);

    useEffect(() => {
        const fetchFournisseurs = async () => {
            if (currentUser) {
                const q = query(collection(firestore, 'fournisseurs'), where('userUID', '==', currentUser.uid));
                const querySnapshot = await getDocs(q);
                const fournisseursData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setFournisseurs(fournisseursData);
                setloading(false);
            }
        };
        fetchFournisseurs();
    }, [currentUser]);
    const deleteFournisseur = async (fournisseurId) => {
        try {
            await deleteDoc(doc(firestore, 'fournisseurs', fournisseurId));
            setFournisseurs(prevFournisseurs => prevFournisseurs.filter(fournisseur => fournisseur.id !== fournisseurId));
        } catch (error) {
            console.error('Error deleting fournisseur: ', error);
        }
    };

    const editFournisseur = (fournisseur) => {
        setEditedFournisseur({ ...fournisseur });
    };

    const saveFournisseur = async () => {
        try {
            await updateDoc(doc(firestore, 'fournisseurs', editedFournisseur.id), editedFournisseur);
            setEditedFournisseur(null);

            // Refetch fournisseurs after saving changes
            const q = query(collection(firestore, 'fournisseurs'), where('userUID', '==', currentUser.uid));
            const querySnapshot = await getDocs(q);
            const fournisseursData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setFournisseurs(fournisseursData);
        } catch (error) {
            console.error('Error saving fournisseur: ', error);
        }
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setEditedFournisseur(prevFournisseur => ({
            ...prevFournisseur,
            [id]: value
        }));
    };

    const handleFilterChange = (e) => {
        setFilterType(e.target.value);
    };

    const filteredFournisseurs = fournisseurs.filter(fournisseur => {
        const valueToFilter = fournisseur[filterType];
        return valueToFilter && typeof valueToFilter === 'string' && valueToFilter.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className='Fournisseur'>
            {loading && <Loader />}
            <span className='shades' id='shade1'></span>

            <div className='FournisseurHeader'>
                <div>
                    <IoCubeOutline /> Fournisseur
                </div>
                <Link to="/dashboard/add-to-fournisseur"><IoIosAddCircleOutline />Fournisseur</Link>
            </div>

            <div className='FournisseurHolder'>
                <div className="filterOptions">
                    <label>
                        <input
                            type="radio"
                            value="prénom"
                            checked={filterType === 'prénom'}
                            onChange={handleFilterChange}
                        />
                        Prénom
                    </label>
                    {/* Add more radio buttons for other filter options */}
                </div>
                <div className='searchBarHolderInFournisseur'>
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
                            <th>Prénom</th>
                            <th>Nom de famille</th>
                            <th>Numéro de téléphone</th>
                            <th>Adresse</th>
                            <th>Fax</th>
                            <th>Email</th>
                            <th>URL Facebook</th>
                            <th style={{ textAlign: "center" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredFournisseurs.map(fournisseur => (
                            <tr key={fournisseur.id}>
                                <td>{editedFournisseur && editedFournisseur.id === fournisseur.id ? <input type="text" id="prénom" value={editedFournisseur.prénom} onChange={handleInputChange} /> : fournisseur.Prénom}</td>
                                <td>{editedFournisseur && editedFournisseur.id === fournisseur.id ? <input type="text" id="nomdefamille" value={editedFournisseur.nomdefamille} onChange={handleInputChange} /> : fournisseur.nomdefamille}</td>
                                <td>{editedFournisseur && editedFournisseur.id === fournisseur.id ? <input type="number" id="numérodetéléphone" value={editedFournisseur.numérodetéléphone} onChange={handleInputChange} /> : fournisseur.numérodetéléphone}</td>
                                <td>{editedFournisseur && editedFournisseur.id === fournisseur.id ? <input type="text" id="adresse" value={editedFournisseur.adresse} onChange={handleInputChange} /> : fournisseur.adresse}</td>
                                <td>{editedFournisseur && editedFournisseur.id === fournisseur.id ? <input type="number" id="fax" value={editedFournisseur.fax} onChange={handleInputChange} /> : fournisseur.fax}</td>
                                <td>{editedFournisseur && editedFournisseur.id === fournisseur.id ? <input type="text" id="email" value={editedFournisseur.email} onChange={handleInputChange} /> : fournisseur.email}</td>
                                <td>{editedFournisseur && editedFournisseur.id === fournisseur.id ? <textarea id="text" value={editedFournisseur.uRLFacebook} onChange={handleInputChange}></textarea> : fournisseur.uRLFacebook}</td>
                                <td style={{ display: "flex", justifyContent: 'center' }}>
                                    {editedFournisseur && editedFournisseur.id === fournisseur.id ? (
                                        <button onClick={saveFournisseur}>Save</button>
                                    ) : (
                                        <>
                                            <button onClick={() => deleteFournisseur(fournisseur.id)} style={{ backgroundColor: '#DC3545', color: "white" }}>Delete</button>
                                            <button onClick={() => editFournisseur(fournisseur)}>Update</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Fournisseur;