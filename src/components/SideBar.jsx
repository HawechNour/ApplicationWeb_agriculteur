import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/authContext';
import { doSignOut } from '../firebase/auth';
import { MdOutlineInsights } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { GoPackage } from "react-icons/go";
import { GrTransaction } from "react-icons/gr";

import { CgProfile } from "react-icons/cg";
import { IoMdHelp } from "react-icons/io";
import { doc, getDoc } from 'firebase/firestore';
import { firestore, storage } from '../firebase/firebase';
import { getDownloadURL, ref } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import Loader from "./Loader"

function SideBar() {
    const { currentUser } = useAuth();
    const [loading, setloading] = useState(true)
    const [userData, setUserData] = useState({});
    const [profileImage, setProfileImage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            if (currentUser) {
                const userDocRef = doc(firestore, "users", currentUser?.uid);
                const docSnap = await getDoc(userDocRef);
                if (docSnap.exists()) {
                    setUserData(docSnap.data()); // Set user data state if document exists
                    // Check if the user has a profile image
                    const storageRef = ref(storage, `profileImages/${currentUser.uid}`);
                    try {
                        const downloadURL = await getDownloadURL(storageRef);
                        setProfileImage(downloadURL);
                        
                    } catch (error) {
                        console.log("Profile image not found or error occurred:", error);
                    }
                    setloading(false)
                } else {
                    console.log("No such document!");
                }
            }
        };
        fetchUserData();
    }, [currentUser]);

    return (
        <div className='UserSideBar'>
            {loading && <Loader/>}
            <h3 className='iconHolder'>
                {profileImage ? (
                    <>
                    <img src={profileImage} alt="Profile" className="profileImage" style={{width : "50px" , height : "50px"}}/>
                    <span className='UserNameInSideBar'>{userData?.fullName}</span>
                    </>
                ) : (
                    <>
                        <span className='UsericonInSideBar'>{userData?.fullName?.slice(0, 2)}</span>
                        <span className='UserNameInSideBar'>{userData?.fullName}</span>
                    </>
                )}
            </h3>
            <div className='insideSideHolderLinks'>
                <div onClick={() => navigate("/dashboard/statistics")}><MdOutlineInsights /> Statistics</div>
                <div onClick={() => navigate("/dashboard/calendar")}><SlCalender /> Calendar</div>
                <div onClick={() => navigate("/dashboard/stock")}><GoPackage /> Stock</div>
                <div onClick={()=> navigate("/dashboard/transactions")}><GrTransaction /> Transactions</div>
                <div onClick={()=> navigate("/dashboard/fournisseur")}><GoPackage /> Fournisseur</div>
                <div onClick={()=> navigate("/dashboard/Client")}><GoPackage /> Client</div>
                <div onClick={()=> navigate("/dashboard/Product")}><GoPackage /> Product</div>
                <div onClick={() => navigate("/dashboard/profile")}><CgProfile /> Profile</div>
                <div onClick={() => navigate("/dashboard/help")}><IoMdHelp /> Help</div>
            </div>
            <button onClick={doSignOut} className='logoutBtn'>Logout</button>
        </div>
    );
}

export default SideBar;