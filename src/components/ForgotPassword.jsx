import React, { useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { doPasswordReset} from '../firebase/auth'
import { useAuth } from '../contexts/authContext'

function ForgotPassword() {
  
    const { userLoggedIn } = useAuth()
    const navigate = useNavigate();
    const [email, setEmail] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const onSubmit = async (e) => {
        e.preventDefault()
        if(! email) return 0;
        doPasswordReset(email)
        navigate("/login")
    }


    return (
        <div>
            {userLoggedIn && (<Navigate to={'/dashboard'} replace={true} />)}

            <main className="LoginPage">
            <div className='NavBarInnerForms'>
                    <p>Logo.</p>
                    <div className="innerNavBarMenu">
                        <Link to={"/register"}>Register</Link>
                        <Link to={"/"}>Home</Link>
                    </div>
                </div>
                <div className="allFormHolder">
                    <h1>Restore Password</h1>
                    <form
                        onSubmit={onSubmit}
                    >
                        <div>
                            <label className="text-sm text-gray-600 font-bold">
                                Email
                            </label>
                            <input
                                type="email"
                                autoComplete='email'
                                required
                                placeholder='Type Email...'
                                value={email} onChange={(e) => { setEmail(e.target.value) }}
                                
                            />
                        </div>



                        {errorMessage && (
                            <span className='ErrorMessage'>{errorMessage}</span>
                        )}

                        <button
                            type="submit"
                            
                        >
                            Restore
                        </button>
                    </form>
                    <p>Don't have an account? <Link to={'/register'} className="hover:underline font-bold">Register</Link></p>
                </div>
            </main>
        </div>
    )
  
}

export default ForgotPassword