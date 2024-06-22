import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import { useAuth } from '../contexts/authContext';
import { Link, useNavigate } from 'react-router-dom';
import { MdPublishedWithChanges } from "react-icons/md";

function ChangeProfile() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [userData, setUserData] = useState({});
    const [editedData, setEditedData] = useState({
        fullName: '',
        phoneNumber: '',
        pays: '',
        ville: '',
        devise: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            if (currentUser) {
                const userDocRef = doc(firestore, "users", currentUser?.uid);
                const docSnap = await getDoc(userDocRef);
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setUserData(userData);
                    // Initialize editedData with userData values
                    setEditedData({
                        fullName: userData.fullName,
                        phoneNumber: userData.phoneNumber,
                        pays: userData.pays,
                        ville: userData.ville,
                        devise: userData.devise
                    });
                } else {
                    console.log("No such document!");
                }
            }
        }
        fetchUserData();
    }, [currentUser]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setEditedData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const saveChanges = async () => {
        try {
            
            const userDocRef = doc(firestore, "users", currentUser?.uid);
            const dataToUpdate = {};

            // Check each field in editedData, if it's not empty, add it to dataToUpdate
            for (const key in editedData) {
                if (editedData[key] !== '') {
                    dataToUpdate[key] = editedData[key];
                }
            }

            await updateDoc(userDocRef, dataToUpdate);
            toast.success('Profile updated successfully');
            navigate("/dashboard/profile");
            
        } catch (error) {
            console.error('Error updating profile: ', error);
            toast.error('Failed to update profile');
        }
    };

    return (
        <div className='ChangeProfile'>
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
            <h1><MdPublishedWithChanges/></h1>
            <span className='shades' id='shade1'></span>
            <span className='shades' id='shade2'></span>
            <div className="modifyInfosHolder">
                <div>
                    <div>
                        <label>Full Name</label>
                        <input type="text" required value={editedData?.fullName} id='fullName' onChange={handleInputChange} />
                    </div>
                    
                </div>
                <div>
                <div>
                        <label>Phone Number</label>
                        <input type="text"  value={editedData?.phoneNumber} id='phoneNumber' onChange={handleInputChange} />
                    </div>
                </div>
                <div>
                <div>
                        <label>Country</label>
                        <input type="text" required value={editedData?.pays} id='pays' onChange={handleInputChange} />
                    </div>
                </div>
                <div>
                    
                    <div>
                        <label>City</label>
                        <input type="text" required value={editedData?.ville} id='ville' onChange={handleInputChange} />
                    </div>
                </div>
                <div>
                <div>
                    <label>Devise</label>
                    <input type="text" required value={editedData?.devise} id='devise' onChange={handleInputChange} />
                </div>
                </div>
            </div>
            <div className='navigationFromChange'>
                <Link to="/dashboard/profile">Cancel</Link>
                <button onClick={saveChanges}>Save</button>
            </div>
        </div>
    )
}

export default ChangeProfile;
