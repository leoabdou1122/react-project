import React, { useEffect, useState } from 'react'
import SignUpForm from '../components/signUpForm';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers } from '../redux/slices/userSlices';
import axios from 'axios';
import SignUpSucces from '../components/signUpSucces';
import { animate } from "framer-motion";

function SignUp() {

  const dispatch = useDispatch();
  const {data, loading, error} = useSelector(state => state.usersData)
  const [signUpSucces, setSignUpSucces] = useState(false)
  useEffect(() => {
    dispatch(fetchAllUsers())
  }, [dispatch])


  const addNewUser = async (userData) => {
    try{
      await axios.post('http://127.0.0.1:3002/user/register', userData)
      .then(() => {
        dispatch(fetchAllUsers())
        setSignUpSucces(true)
        animate('.signup-form', {filter: "blur(10px)"})
      })
    } catch (error) {
      console.log('Error to register', error)
    }
  }

  const closeMsg = () => {
    setSignUpSucces(false)
    animate('.signup-form', {filter: "blur(0px)"})
  }
  return (
    <div className='signup-page'>
      <SignUpForm data={data} register={addNewUser}/>
      {signUpSucces && <SignUpSucces closeMsg={closeMsg}/>}
    </div>
  )
}

export default SignUp;