import React , {useState , useEffect } from 'react'
import { useAuth  } from '../contexts/authContext'
import {  doEmailChange } from '../firebase/auth'
import { Link, useNavigate } from 'react-router-dom';
import { doc , getDoc } from 'firebase/firestore';
import { firestore, storage } from '../firebase/firebase';
import { ToastContainer, toast } from 'react-toastify';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { CgProfile } from "react-icons/cg";
import { FaPhoneAlt } from "react-icons/fa";
import { FaMoneyCheckAlt } from "react-icons/fa";
import Loader from "./Loader"
import 'react-toastify/dist/ReactToastify.css';
function Profile() {
    const { currentUser } = useAuth();
    const [userData, setUserData] = useState({});
    const [emailDisable, setemailDisable] = useState(true);
    const [profileImage, setProfileImage] = useState(null);
    const [imageURL, setImageURL] = useState('');
    const [loading, setLoading] = useState(false);
    const [saveButtonVisible, setSaveButtonVisible] = useState(false);
    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true)
        if(currentUser){
            const userDocRef = doc(firestore, "users", currentUser?.uid);
            const docSnap = await getDoc(userDocRef);
            if (docSnap.exists()) {
                setUserData(docSnap.data());

                // Check if the user has a profile image
                const storageRef = ref(storage, `profileImages/${currentUser.uid}`);
                try {
                    await getDownloadURL(storageRef);
                    // Profile image exists, set the profile image state
                    setImageURL(await getDownloadURL(storageRef));
                } catch (error) {
                    // Profile image does not exist or error occurred while fetching
                    console.log("Profile image not found or error occurred:", error);
                }
            } else {
                console.log("No such document!");
            }
        }
            setLoading(false)
        }
        fetchUserData()
    }, [])

    const emailChangeHandler = async () => {
        const newMail = document.getElementById("email").value
        const password = document.getElementById("password").value
        if(newMail === "" || password == "") return 0
        document.getElementById("email").value = ""
        document.getElementById("password").value = ""
        setemailDisable(true)
        const res = await doEmailChange(newMail,password)
        
        if (res.success) {
            toast.success('Email Changed Successfully ✅', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: "Bounce",
                });
                document.getElementById("email").value = newMail
        }
    }

    const handleImageChange = (e) => {
        const imageFile = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const aspectRatio = img.width / img.height;
                if (aspectRatio >= 0.8 && aspectRatio <= 1.2) {
                    setProfileImage(imageFile);
                    setImageURL(event.target.result);
                    setSaveButtonVisible(true);
                } else {
                    toast.error('Please select an image with a balanced aspect ratio (width/height).');
                }
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(imageFile);
    };

    const uploadProfileImage = async () => {
        setLoading(true);
        try {
            // Create a reference to the storage location using the user's UID
            const storageRef = ref(storage, `profileImages/${currentUser?.uid}`);
            
            // Check if the user already has a profile image
            try {
                // If the user has a profile image, delete the existing one
                await storageRef.getMetadata();
                await storageRef.delete();
                console.log('Existing profile image deleted successfully.');
            } catch (error) {
                // Profile image not found or error occurred while fetching metadata
                console.log('No existing profile image found:', error);
            }
    
            // Upload the new image file to the storage location
            await uploadString(storageRef, imageURL, 'data_url');
            
            // Get the download URL of the uploaded image
            const downloadURL = await getDownloadURL(storageRef);
            toast.success('Profile image uploaded successfully!');
            setLoading(false);
            setSaveButtonVisible(false); // Hide the save button after uploading
        } catch (error) {
            console.error('Error uploading profile image:', error);
            toast.error('Failed to upload profile image. Please try again later.');
            setLoading(false);
        }
    };

  return (
    <div className='ProfilePage'>
        {loading && <Loader/>}
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
        <h1 className="ProfileTitle"><CgProfile/>Profile</h1>
        <div className='switchBtn'>
            <button >My Profile</button>
            <button id='subBtn'>Subscription</button>
        </div>

        <div className='profileInfoHolder'>
                <h3 className='iconHolderInsideProfile'>
                    {profileImage || imageURL ? (
                        <div>
                            <label htmlFor="profileImage">
                                <img src={imageURL || URL.createObjectURL(profileImage)} alt="Profile" />
                                <input 
                                    id="profileImage" 
                                    type="file" 
                                    accept="image/*" 
                                    style={{ display: "none" }} 
                                    onChange={handleImageChange} 
                                />
                            </label>
                            
                        </div>
                        ) : (
                            <label htmlFor="profileImage">
                                <span className='UsericonInSideBar'>{userData?.fullName?.slice(0,2)}</span>
                                <input 
                                    id="profileImage" 
                                    type="file" 
                                    accept="image/*" 
                                    style={{ display: "none" }} 
                                    onChange={handleImageChange} 
                                />
                            </label>
                    )}
                    <p className='userNameInIcon'>{userData?.fullName}</p>
                    {saveButtonVisible && (
                        <button onClick={uploadProfileImage} disabled={loading} className='saveBtn'>Save</button>
                    )}
                </h3>
            <div className='textProfileData'>
                <div className='changeEmailHolder'>
                    {emailDisable && <input type='text' value={currentUser?.email} disabled={emailDisable} ></input>}
                    {!emailDisable && <input type='text' id='email' placeholder='type new email' ></input>}
                    {!emailDisable && <input type='text' id='password' placeholder='type password'></input>}
                    {!emailDisable && <button onClick={emailChangeHandler}>Save</button>}
                    {emailDisable && <button onClick={(e)=>setemailDisable(false)}>Change Email</button>}
                </div>
                <div className='infoDivProfile'>
                    <div >
                        <FaPhoneAlt/>
                        <label>{userData?.phoneNumber || "Not Set Yet"}</label>
                    </div>
                    <div >
                        <FaMoneyCheckAlt/>
                        <label>{userData?.devise || "Not Set Yet"}</label>
                    </div>
                </div>
                <div className='infoDivProfile'>
                    <div >
                        <label>City</label>
                        <label>{userData?.ville || "Not Set Yet"}</label>
                    </div>
                    <div >
                        <label>Country</label>
                        <label>{userData?.pays || "Not Set Yet"}</label>
                    </div>
                </div>
            </div>
        </div>

        <div className='navigationFromProfile'>
            <Link to="/dashboard/chnage-profile">Modify My Profile</Link>
            <Link to="/dashboard/chnage-password">Chnage My Password</Link>
        </div>  
    </div>
  )
}

export default Profile