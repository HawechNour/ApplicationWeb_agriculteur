import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import { useAuth } from '../contexts/authContext';
import { IoCubeOutline } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";
import Loader from './Loader';
function Client() {
    const { currentUser } = useAuth();
    const [clients, setClients] = useState([]);
    const [editedClient, setEditedClient] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('nom'); // Default filter type
    const [loading, setloading] = useState(true);

    useEffect(() => {
        const fetchClients = async () => {
            if (currentUser) {
                const q = query(collection(firestore, 'clients'), where('userUID', '==', currentUser.uid));
                const querySnapshot = await getDocs(q);
                const clientsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setClients(clientsData);
                setloading(false);
            }
        };
        fetchClients();
    }, [currentUser]);
    const deleteClient = async (clientId) => {
        try {
            await deleteDoc(doc(firestore, 'clients', clientId));
            setClients(prevClients => prevClients.filter(client => client.id !== clientId));
        } catch (error) {
            console.error('Error deleting client: ', error);
        }
    };

    const editClient = (client) => {
        setEditedClient({ ...client });
    };

    const saveClient = async () => {
        try {
            await updateDoc(doc(firestore, 'clients', editedClient.id), editedClient);
            setEditedClient(null);

            // Refetch clients after saving changes
            const q = query(collection(firestore, 'clients'), where('user', '==', currentUser.uid));
            const querySnapshot = await getDocs(q);
            const clientsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setClients(clientsData);
        } catch (error) {
            console.error('Error saving client: ', error);
        }
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setEditedClient(prevClient => ({
            ...prevClient,
            [id]: value
        }));
    };

    const handleFilterChange = (e) => {
        setFilterType(e.target.value);
    };

    const filteredClients = clients.filter(client => {
        const valueToFilter = client[filterType];
        return valueToFilter && typeof valueToFilter === 'string' && valueToFilter.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className='Client'>
            {loading && <Loader />}
            <span className='shades' id='shade1'></span>

            <div className='ClientHeader'>
                <div>
                    <IoCubeOutline /> Client
                </div>
                <Link to="/dashboard/add-to-client"><IoIosAddCircleOutline />Client</Link>
            </div>

            <div className='ClientHolder'>
                <div className="filterOptions">
                    <label>
                        <input
                            type="radio"
                            value="nom"
                            checked={filterType === 'nom'}
                            onChange={handleFilterChange}
                        />
                        nom
                    </label>

                    {/* Add more radio buttons for other filter options */}
                </div>
                <div className='searchBarHolderInClient'>
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
                            <th>Nom</th>
                            <th>Contact</th>
                            <th>Adresse</th>
                            
                            <th style={{ textAlign: "center" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClients.map(client => (
                            <tr key={client.id}>
                                <td>{editedClient && editedClient.id === client.id ? <input type="text" id="nom" value={editedClient.nom} onChange={handleInputChange} /> : client.nom}</td>
                                <td>{editedClient && editedClient.id === client.id ? <input type="number" id="contact" value={editedClient.contact} onChange={handleInputChange} /> : client.contact}</td>
                                <td>{editedClient && editedClient.id === client.id ? <input type="text" id="adresse" value={editedClient.adresse} onChange={handleInputChange} /> : client.adresse}</td>
                                
                                
                                <td style={{ display: "flex", justifyContent: 'center' }}>
                                    {editedClient && editedClient.id === client.id ? (
                                        <button onClick={saveClient}>Save</button>
                                    ) : (
                                        <>
                                            <button onClick={() => deleteClient(client.id)} style={{ backgroundColor: '#DC3545', color: "white" }}>Delete</button>
                                            <button onClick={() => editClient(client)}>Update</button>
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

export default Client;