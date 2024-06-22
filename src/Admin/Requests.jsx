import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaHandsHelping } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";

const Requests = () => {
  const [helpRequests, setHelpRequests] = useState([]);

  useEffect(() => {
    const fetchHelpRequests = async () => {
      try {
        const helpRequestsSnapshot = await getDocs(collection(firestore, 'help-requests'));
        const helpRequestsData = helpRequestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHelpRequests(helpRequestsData);
      } catch (error) {
        console.error('Error fetching help requests:', error);
      }
    };

    fetchHelpRequests();
  }, []);

  const handleMarkAsDone = async (requestId) => {
    try {
      await updateDoc(doc(firestore, 'help-requests', requestId), {
        replayed: true
      });
      // Update state to reflect the change
      setHelpRequests(prevRequests => prevRequests.map(request => {
        if (request.id === requestId) {
          return { ...request, replayed: true };
        }
        return request;
      }));
      toast.success('Help request marked as done successfully.');
    } catch (error) {
      console.error('Error marking help request as done:', error);
      toast.error('Error marking help request as done.');
    }
  };

  const handleDeleteRequest = async (requestId) => {
    try {
      await deleteDoc(doc(firestore, 'help-requests', requestId));
      // Update state to remove the deleted request
      setHelpRequests(prevRequests => prevRequests.filter(request => request.id !== requestId));
      toast.success('Help request deleted successfully.');
    } catch (error) {
      console.error('Error deleting help request:', error);
      toast.error('Error deleting help request.');
    }
  };

  return (
    <div className="requests">
      <h2><FaHandsHelping></FaHandsHelping>Help Requests</h2>
      <span className='shades' id='shade1'></span>
      <span className='shades' id='shade2'></span>
      <div className='requestCardsHolder'>
      {helpRequests.map(request => (
        <div key={request.id} className="request-card">
          <p className="email"><MdOutlineAlternateEmail></MdOutlineAlternateEmail>{request.email}</p>
          <p className="phone"><FaPhone></FaPhone>{request.phoneNumber}</p>
          <p className="name"><span>{request.name}</span></p>
          
          <p className="message"><span>Message</span><label>{request.message}</label></p>
          <p className={`status ${request.replayed ? 'replayed' : 'pending'}`}>{request.replayed ? 'Replayed' : 'Pending'}</p>
          
          
          <div className='innerRequestCardBtnHolder'>
            {!request.replayed && (
              <button className="mark-done-btn" onClick={() => handleMarkAsDone(request.id)}>Mark as Done</button>
            )}
            <button className="delete-btn" onClick={() => handleDeleteRequest(request.id)}>Delete</button>
          </div>
          
        </div>
      ))}
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
    </div>
  );
};

export default Requests;
