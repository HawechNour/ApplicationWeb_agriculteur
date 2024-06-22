import React, { useState } from 'react';
import { useAuth } from '../contexts/authContext';
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import { ToastContainer, toast } from 'react-toastify';
import bg from '../assets/undraw_detailed_information_re_qmuc.svg'
function Help() {
    const { currentUser } = useAuth();
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [phoneNumber, setphoneNumber] = useState("")
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Check if user is authenticated
            if (!currentUser) {
                console.error('User is not authenticated.');
                return;
            }

            // Check if name and message are not empty
            if (!name || !message) {
                console.error('Name and message are required.');
                return;
            }

            // Add help request to Firestore
            const docRef = await addDoc(collection(firestore, 'help-requests'), {
                email: currentUser.email,
                name,
                userUID : currentUser.uid,
                message,
                phoneNumber,
                replayed: false
            });
            setName('')
            setMessage('')
            // Show success toast
            toast.success('Help request submitted successfully!');
        } catch (error) {
            console.error('Error adding help request: ', error);
            // Show error toast
            toast.error('Failed to submit help request. Please try again later.');
        }
    };

    return (
        <div className='Help'>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={"Bounce"}
            />
            <span className='shades' id='shade1'></span>
            <span className='shades' id='shade2'></span>
            <div className="headerInnerHelp">
                <label>You Need Help ?</label>
                <label>Get In Touch With Us !</label>
            </div>
            <img src={bg}></img>
            <form className='formHolder' onSubmit={handleSubmit}>
                
                <div><label htmlFor="name">Your Name</label>
                <input required type="text" id="name" value={name} placeholder='Type Your Name' onChange={(e) => setName(e.target.value)} /></div>
                <div>
                    <label htmlFor='phoneNumber'>
                        Phone Number
                    </label>
                    <input required type="text" id="phoneNumber" value={phoneNumber} placeholder='Type Your Phone Number' onChange={(e) => setphoneNumber(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="message">Your Message</label>
                    <textarea required id="message" value={message} placeholder='Type Your Messages' onChange={(e) => setMessage(e.target.value)} />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default Help;
