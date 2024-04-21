import React from 'react'
import { BsXLg, BsCheckLg  } from "react-icons/bs";
import { Link } from 'react-router-dom';

function SignUpSucces({closeMsg}) {
  return (
    <div className='signup-succes-msg'>
        <div className='close-btn' onClick={closeMsg}>
            <BsXLg size={20}/>
        </div>
        <BsCheckLg size={100}/>
        <div className='msg'>
           <div> You Have Sign Up an Account Successfully. Now you can Log in to your Account.</div>
            <Link to='/signin'>
              Sign In
            </Link>
        </div>
    </div>
  )
}

export default SignUpSucces;