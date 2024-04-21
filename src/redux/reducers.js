import { combineReducers } from 'redux';
import userSlices from './slices/userSlices';
import authSlices from './slices/authSlices';
import cartSlices from './slices/cartSlices';

const rootReducer = combineReducers({
    usersData : userSlices,
    userAuth : authSlices,
    userCart : cartSlices
})

export default rootReducer;