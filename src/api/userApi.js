import axios from 'axios';

export const getAllUsers = async () => {
    try {
        const users = await axios.get('http://127.0.0.1:3002/user/allUsers')
        return users.data
    } catch (error) {
        console.log('error to get all users: ', error)
    }
}