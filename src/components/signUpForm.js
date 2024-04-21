import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { validateName, validateEmail, validatePassword, validatePasswordMatch } from '../utils/formValidation';
import {motion} from 'framer-motion'
import { BsEye, BsEyeSlash } from "react-icons/bs";
function SignUpForm({data, register}) {

    const [firstname, setFirstname] = useState({
        value : '',
        errorMsg : null
    })
    const [lastname, setLastname] = useState({
        value : '',
        errorMsg : null
    })
    const [email, setEmail] = useState({
        value : '',
        errorMsg : null
    })
    const [password, setPassword] = useState({
        value : '',
        showPassword: false,
        errorMsg : null
    })
    const [cpassword, setCpassword] = useState({
        value : '',
        showPassword: false,
        errorMsg : null
    })

    const showPassword = () => {
        setPassword({...password, showPassword : !password.showPassword})
      }
      
    const showCpassword = () => {
        setCpassword({...cpassword, showPassword : !cpassword.showPassword})
    }

    const handelChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        switch (name) {
            case 'firstname':
                setFirstname({...firstname, value : value})
                break;
            case 'lastname':
                setLastname({...lastname, value : value})
                break;
            case 'email':
                setEmail({...email, value : value.toLowerCase()})
                break;
            case 'password':
                setPassword({...password, value : value})
                break;
            case 'cpassword':
                setCpassword({...cpassword, value : value})
                break;
            default :

        }
    }

    const handelSubmit = (event) => {
        event.preventDefault();

        const firstnameError = validateName(firstname.value);
        const lastnameError = validateName(lastname.value);
        const emailError = validateEmail(email.value);
        const passwordError = validatePassword(password.value);
        const cpasswordError = validatePassword(cpassword.value);
        const passwordsMatchError = validatePasswordMatch(password.value, cpassword.value);

        setFirstname({...firstname, errorMsg : firstnameError})
        setLastname({...lastname, errorMsg : lastnameError})
        setEmail({...email, errorMsg : emailError})
        setPassword({...password, errorMsg : passwordError})
        setCpassword({...cpassword, errorMsg : cpasswordError})
        setCpassword({...cpassword, errorMsg : passwordsMatchError})

        if (!firstnameError && !lastnameError && !emailError  && !passwordError && !cpasswordError && !passwordsMatchError) {
          const isEmailInArray = data.some((user) => user.email === email.value)

          if (isEmailInArray){
            setEmail({...email, errorMsg : 'This email already existe'})
          }else {
              const userData = {
                "first_name": firstname.value,
                "last_name": lastname.value,
                "email": email.value,
                "password": password.value,
              }
              register(userData)
            }
        }
    }



    
    console.log(data)
  return (
    <motion.div className='signup-form' 
    initial={{ opacity: 0, scale: 0.8 }} 
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.2, delay: 0.2}}>
        <form onSubmit={handelSubmit}>
            <h2>Sign Up</h2>
            <div className='inputs'>
                <div className='input'>
                    <input type='text' placeholder='First name' name='firstname' onChange={handelChange}/>
                    {firstname.errorMsg && <span className='error-msg'>{firstname.errorMsg}</span>}
                </div>
                <div className='input'>
                    <input type='text' placeholder='Last name' name='lastname'  onChange={handelChange}/>
                    {lastname.errorMsg && <span className='error-msg'>{lastname.errorMsg}</span>}
                </div>
                <div className='input'>
                    <input type='text' placeholder='Email' name='email'  onChange={handelChange}/>
                    {email.errorMsg && <span className='error-msg'>{email.errorMsg}</span>}
                </div>
                <div>
                    <div className='password-input'>
                        <input type={!password.showPassword ? 'password' : 'text'} placeholder='Password' name='password'  onChange={handelChange}/>
                        {password.showPassword 
                        ? <BsEyeSlash className='showPassword' onClick={showPassword}/> 
                        : <BsEye className='showPassword' onClick={showPassword}/>}
                    </div>
                    {password.errorMsg && <span className='error-msg'>{password.errorMsg}</span>}
                </div>
                <div>
                    <div className='password-input'>
                        <input type={!cpassword.showPassword ? 'password' : 'text'} placeholder='Confirme Password' name='cpassword'  onChange={handelChange}/>
                        {password.showPassword 
                        ? <BsEyeSlash className='showPassword' onClick={showCpassword}/> 
                        : <BsEye className='showPassword' onClick={showCpassword}/>}
                    </div>
                    {cpassword.errorMsg && <span className='error-msg'>{cpassword.errorMsg}</span>}
                </div>
                <div className='password-input'>
                    
                    
                </div>
            </div>
            <button type='submit'>Sign in</button>
            <div className='newUser'>
                <span className='goToSignUP'>Already have an account? <Link to='/signin'>Sign In</Link></span>
            </div>
        </form>
    </motion.div>
  )
}

export default SignUpForm;