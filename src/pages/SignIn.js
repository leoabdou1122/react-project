import React, { useEffect } from 'react'
import SignInForm from '../components/signInForm';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers } from '../redux/slices/userSlices';


function SignIn() {

  const dispatch = useDispatch();
  const {data, loading, error} = useSelector(state => state.usersData)
  
  useEffect(() => {
    dispatch(fetchAllUsers())
  }, [])


  return (
    <div className='signin-page'>
      <SignInForm data={data}/>
    </div>
  )
}

export default SignIn;