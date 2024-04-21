import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import {validateEmail, validatePassword} from '../utils/formValidation';
import axios from 'axios';
import Cookies from 'js-cookie';
import {motion} from 'framer-motion'
import { BsEye, BsEyeSlash } from "react-icons/bs";

function SignInForm({data}) {

    const [email, setEmail] = useState({
        value : '',
        errorMsg : null
    })
    const [password, setPassword] = useState({
        value : '',
        showPassword : false,
        errorMsg : null
    })

    const handelChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        switch (name) {
            case 'email':
                setEmail({...email, value : value.toLowerCase()})
                break;
            case 'password':
                setPassword({...password, value : value})
                break;
            default :
        }
    }

    const showPassword = () => {
        setPassword({...password, showPassword : !password.showPassword})
    }


    const handelSubmit = async (e) => {
        e.preventDefault();

        const emailError = validateEmail(email.value);
        const passwordError = validatePassword(password.value);
        const isEmailInArray = data.some((user) => user.email === email.value)

        setEmail({...email, errorMsg : emailError})
        setPassword({...password, errorMsg : passwordError})
        if(!emailError){
            if (!isEmailInArray) {
                setEmail({...email, errorMsg : 'This email is not existe'})
            }
        }

        console.log(email.errorMsg)
        if(!emailError && !passwordError){
            const userData = {
                "email": email.value,
                "password": password.value,
            }

            try{
                await axios.post('http://localhost:3002/user/login', userData, { withCredentials: true })
                const expirationTimeInDays = 1;
                const expirationDate = new Date();
                expirationDate.setDate(expirationDate.getDate() + expirationTimeInDays);
                Cookies.set('user', true, {
                  expires: expirationDate,
                  path: '/',
                });
                window.location.reload();
              } catch (error) {
                console.log('Error to login', error)
                setPassword({...password, errorMsg : 'Password Incorrect'})
              }
        }
    }
    console.log(data)
  return (
    <motion.div className='signin-form' 
    initial={{ opacity: 0, scale: 0.7 }} 
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay: 0.5, ease: [0, 0.71, 0.2, 1.01]}}>
        <form onSubmit={handelSubmit}>
            <h2>Sign in</h2>
            <div className='inputs'>
                <div className='input'>
                    <input type='text' placeholder='Email' name='email' onChange={handelChange}/>
                    {email.errorMsg && <span className='error-msg'>{email.errorMsg}</span>}
                </div>
                <div className='password'>
                    <div className='password-input'>
                        <input type={!password.showPassword ? 'password' : 'text'} placeholder='Password' name='password' onChange={handelChange}/>
                        {password.showPassword 
                        ? <BsEyeSlash className='showPassword' onClick={showPassword}/> 
                        : <BsEye className='showPassword' onClick={showPassword}/>}
                    </div>
                    {password.errorMsg && <span className='error-msg'>{password.errorMsg}</span>}
                </div>
            </div>
            <span>Forgot your password?</span>
            <button type='submit'>Sign in</button>
            <div className='newUser'>
                <span className='goToSignUP'>Don't have an account? <Link to='/signup'>Sign Up</Link></span>
            </div>
        </form>
    </motion.div>
  )
}

export default SignInForm;