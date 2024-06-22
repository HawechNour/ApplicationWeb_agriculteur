import React from 'react'
import { IoMdHelp } from 'react-icons/io'
import { MdOutlineInsights } from 'react-icons/md'
import { TbUsersGroup } from "react-icons/tb";
import { useNavigate } from 'react-router-dom'

function AdminSideBar() {
    const navigate = useNavigate()
  return (
    <div className='UserSideBar'>
            
            <h3 className='iconHolder'>
                
                
                <span className='UsericonInSideBar'>Admin</span>
                <span className='UserNameInSideBar'>Welcome Back</span>
                
                
            </h3>

            <div className='insideSideHolderLinks'>
                <div onClick={() => navigate("/owner/stats")}><MdOutlineInsights /> Statistics</div>
                <div onClick={() => navigate("/owner/users")}><TbUsersGroup /> Users</div>
                <div onClick={() => navigate("/owner/requests")}><IoMdHelp /> Requests</div>
                
            </div>
            <button onClick={()=>{
                localStorage.setItem("adminAuth","");
                localStorage.setItem("adminPassword","");
                window.location.reload()
            }} className='logoutBtn'>Logout</button>
        </div>
  )
}

export default AdminSideBar