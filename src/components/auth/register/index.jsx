import React, { useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/authContext'
import { doCreateUserWithEmailAndPassword } from '../../../firebase/auth'

const Register = () => {

    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setfullName] = useState('')
    const [phoneNumber, setphoneNumber] = useState('')
    const [ville, setville] = useState('')
    const [pays, setpays] = useState('')
    const [devise, setdevise] = useState('')
    const [confirmPassword, setconfirmPassword] = useState('')
    const [isRegistering, setIsRegistering] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const { userLoggedIn } = useAuth()

    const onSubmit = async (e) => {
        e.preventDefault()
        if(!isRegistering) {
            try {
                setIsRegistering(true)
                await doCreateUserWithEmailAndPassword(email, password,fullName,phoneNumber,ville,pays,devise)
            } catch (error) {
                setErrorMessage(error.message)
            }
        }
    }

    return (
        <>
            {userLoggedIn && (<Navigate to={'/dashboard'} replace={true} />)}

            <main className="LoginPage SignupPage" style={{justifyContent : "start"}}>
                <div className='NavBarInnerForms'>
                    <p>Logo.</p>
                    <div className="innerNavBarMenu">
                        <Link to={"/login"}>Login</Link>
                        <Link to={"/"}>Home</Link>
                    </div>
                </div>
                <div className="allFormHolder SignUpallFormHolder">
                    <h1>Create a New Account</h1>
                    <form
                        onSubmit={onSubmit}
                        className="space-y-4"
                    >
                        

                        <span className="bothHolder">
                            <div className='inputGroup'>
                                <label className="text-sm text-gray-600 font-bold">
                                    Email
                                </label>
                                <input
                                    required
                                    type="email"
                                    autoComplete='email'
                                    placeholder='Email'
                                    
                                    value={email} onChange={(e) => { setEmail(e.target.value) }}
                                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:indigo-600 shadow-sm rounded-lg transition duration-300"
                                />
                            </div>
                            <div className='inputGroup'>
                                <label className="text-sm text-gray-600 font-bold">
                                    Full Name
                                </label>
                                <input
                                    required
                                    disabled={isRegistering}
                                    type="text"
                                    autoComplete='off'
                                    placeholder='Full Name'
                                    
                                    value={fullName} onChange={(e) => { setfullName(e.target.value) }}
                                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                                />
                            </div>
                        </span>
                              
                        
                        <span className="bothHolder">
                            <div className='inputGroup'>
                                <label className="text-sm text-gray-600 font-bold">
                                    Password
                                </label>
                                <input
                                    required
                                    disabled={isRegistering}
                                    type="password"
                                    autoComplete='new-password'
                                    
                                    placeholder='Password'
                                    value={password} onChange={(e) => { setPassword(e.target.value) }}
                                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                                />
                            </div>
                            <div className='inputGroup'>
                                <label className="text-sm text-gray-600 font-bold">
                                    Confirm Password
                                </label>
                                <input
                                    required
                                    disabled={isRegistering}
                                    type="password"
                                    autoComplete='off'
                                    placeholder='Confirm Password'
                                    
                                    value={confirmPassword} onChange={(e) => { setconfirmPassword(e.target.value) }}
                                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                                />
                            </div>
                        </span>
                        
                        
                        <span className="bothHolder">
                            <div className='inputGroup'>
                                <label className="text-sm text-gray-600 font-bold">
                                    City
                                </label>
                                <input
                                    required
                                    disabled={isRegistering}
                                    type="text"
                                    autoComplete='off'
                                    
                                    placeholder='City'
                                    value={ville} onChange={(e) => { setville(e.target.value) }}
                                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                                />
                            </div>
                            
                            <div className='inputGroup'>
                                <label className="text-sm text-gray-600 font-bold">
                                    Country
                                </label>
                                <input
                                    required
                                    disabled={isRegistering}
                                    type="text"
                                    autoComplete='off'
                                    placeholder='Country'
                                    
                                    value={pays} onChange={(e) => { setpays(e.target.value) }}
                                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                                />
                            </div>
                        </span>

                        <div className='inputGroup'>
                            <label className="text-sm text-gray-600 font-bold">
                                Currency
                            </label>
                            <input
                                required
                                disabled={isRegistering}
                                type="text"
                                autoComplete='off'
                                
                                placeholder='Currency'
                                value={devise} onChange={(e) => { setdevise(e.target.value) }}
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                            />
                        </div>

                        {errorMessage && (
                            <span className='text-red-600 font-bold'>{errorMessage}</span>
                        )}

                        <button
                            type="submit"
                            disabled={isRegistering}
                            className={`w-full px-4 py-2 text-white font-medium rounded-lg ${isRegistering ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300'}`}
                        >
                            {isRegistering ? 'Signing Up...' : 'Register'}
                        </button>
                        <span className="bb">
                            Already have an account? {'   '}
                            <Link to={'/login'} className="text-center text-sm hover:underline font-bold">Continue</Link>
                        </span>
                    </form>
                </div>
            </main>
        </>
    )
}

export default Register