import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc , query , where} from 'firebase/firestore';
import { ref, deleteObject , getDownloadURL } from 'firebase/storage';
import { firestore, storage } from '../firebase/firebase'; // Assuming you have exported firestore and storage from firebaseConfig.js
import { FaSearch, FaUsersCog } from "react-icons/fa";
import Loader from "../components/Loader"
import { ToastContainer, toast } from 'react-toastify';
const Users = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setloading] = useState(true)
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const usersSnapshot = await getDocs(collection(firestore, 'users'));
          const usersData = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setUsers(usersData);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
        setloading(false)
        console.log(users);
      };
      
      fetchUsers();
    }, []);

    const handleDeleteUser = async (userId) => {
      setloading(true)
      try {
        // Delete user's image from Storage
        const imagePath = `profileImages/${userId}`;
        const imageRef = ref(storage, imagePath);
        try {
          await getDownloadURL(imageRef);
          // If the image exists, delete it
          await deleteObject(imageRef);
          console.log(`Image for user with ID ${userId} deleted successfully.`);
        } catch (error) {
          // If the image doesn't exist, continue without deleting
          console.log(`Image for user with ID ${userId} does not exist.`);
        }
    
        // Delete sales documents associated with the user
        const salesQuerySnapshot = await getDocs(query(collection(firestore, 'sales'), where('userUID', '==', userId)));
        salesQuerySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
    
        // Delete purchases documents associated with the user
        const purchasesQuerySnapshot = await getDocs(query(collection(firestore, 'purchases'), where('userUID', '==', userId)));
        purchasesQuerySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
    
        // Delete movements documents associated with the user
        const movementsQuerySnapshot = await getDocs(query(collection(firestore, 'movements'), where('user', '==', userId)));
        movementsQuerySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
    
        // Delete help requests documents associated with the user
        const helpRequestsQuerySnapshot = await getDocs(query(collection(firestore, 'help-requests'), where('userUID', '==', userId)));
        helpRequestsQuerySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
    
        // Delete events documents associated with the user
        const eventsQuerySnapshot = await getDocs(query(collection(firestore, 'events'), where('userUid', '==', userId)));
        eventsQuerySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
    
        // Delete products associated with the user
        const productsQuerySnapshot = await getDocs(query(collection(firestore, 'products'), where('user', '==', userId)));
        productsQuerySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
    
        // Delete stock associated with the user
        const stockQuerySnapshot = await getDocs(query(collection(firestore, 'stock'), where('userUID', '==', userId)));
        stockQuerySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
    
        // Delete fournisseurs associated with the user
        const fournisseursQuerySnapshot = await getDocs(query(collection(firestore, 'fournisseurs'), where('userUID', '==', userId)));
        fournisseursQuerySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
    
        // Delete clients associated with the user
        const clientsQuerySnapshot = await getDocs(query(collection(firestore, 'clients'), where('userUID', '==', userId)));
        clientsQuerySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
    
        // Show success toast notification
        toast.success(`All data for user with ID ${userId} deleted successfully.`, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        });
    
        console.log(`All data for user with ID ${userId} deleted successfully.`);
      } catch (error) {
        console.error('Error deleting user and associated data:', error);
        toast.error('Error deleting user and associated data. Please try again later.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        });
      }
      setloading(false)
    };
      
  
    const handleSearch = (e) => {
      setSearchTerm(e.target.value);
      console.log('Search term:', e.target.value);
    };
  
    const filteredUsers = users.filter(user => {
      if (searchTerm === '') {
        return true; // Show all users if search query is empty
      } else {
        // Filter based on user properties (e.g., username, email)
        return user.fullName?.toLowerCase().includes(searchTerm?.toLowerCase())
      }
    });
  
    console.log('Filtered users:', filteredUsers);
  
    return (
      <div className='usersManagment'>
        <ToastContainer/>
        {loading && <Loader/>}
        <h2><FaUsersCog></FaUsersCog>Users Management</h2>

        <div className='searchBarHolderInStock'>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearch}
              style={{backgroundColor : "transparent"}}
            />
            <label><FaSearch/></label>
        </div>

        <span className='shades' id='shade1'></span>
        <span className='shades' id='shade2'></span>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Devise</th>
              <th>Pays</th>
              <th>Ville</th>
              <th style={{textAlign : "center"}}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.fullName}</td>
                <td>{user.devise}</td>
                <td>{user.pays}</td>
                <td>{user.ville}</td>
                <td style={{display : "flex" , justifyContent : 'center'}}>
                  <button style={{backgroundColor : '#DC3545',color : "white"}} onClick={() => handleDeleteUser(user.id)}>Reset</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

export default Users;
