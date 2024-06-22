import React, { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { doSignInWithEmailAndPassword , doSendEmailVerification} from '../../../firebase/auth'
import { useAuth } from '../../../contexts/authContext'

const Login = () => {
    const { userLoggedIn } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault()
        if(!isSigningIn) {
            try {
                setIsSigningIn(true)
                await doSignInWithEmailAndPassword(email, password)
                doSendEmailVerification()
            } catch (error) {
                setErrorMessage("Wrong Email Or Password !")
                setIsSigningIn(false)
            }
        }
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
                    <h1>Welcome Back</h1>
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
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                            />
                        </div>


                        <div>
                            <label className="text-sm text-gray-600 font-bold">
                                Password
                            </label>
                            <input
                                type="password"
                                autoComplete='current-password'
                                required
                                placeholder='Type Password...'
                                value={password} onChange={(e) => { setPassword(e.target.value) }}
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                            />
                        </div>

                        {errorMessage && (
                            <span className='ErrorMessage'>{errorMessage}</span>
                        )}

                        <button
                            type="submit"
                            disabled={isSigningIn}
                            className={`w-full px-4 py-2 text-white font-medium rounded-lg ${isSigningIn ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300'}`}
                        >
                            {isSigningIn ? 'Signing In...' : 'Login'}
                        </button>
                    </form>
                    <p>Forgot Your Password ? <Link to={'/forgot-password'} className="hover:underline font-bold">Restore</Link></p>
                    <p>Don't have an account? <Link to={'/register'} className="hover:underline font-bold">Register</Link></p>
                    
                </div>
            </main>
        </div>
    )
}

export default Login