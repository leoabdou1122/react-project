import validator from 'validator';

export const validateName = (firstname) => {
    if (validator.isEmpty(firstname)){
        return 'First name is required'
    }
    if (!validator.isAlpha(firstname)){
        return 'Only alphabets are allowed'
    }
    return null
} 

export const validateEmail = (email) => {
    if (validator.isEmpty(email)){
        return 'Email is required'
    }
    if (!validator.isEmail(email)) {
        return 'Invalid Email Format'
    }
    return null
}

export const validatePhoneNumber = (phoneNumber) => {
    if (validator.isEmpty(phoneNumber)){
        return 'Phone number is required'
    }
    return null
}

export const validatePassword = (password) => {
    if (validator.isEmpty(password)){
        return 'Password is required'
    }
    return null
}

export const validatePasswordMatch = (password, confirmPassword) => {
    if (validator.isEmpty(confirmPassword) && validator.isEmpty(password)){
        return 'Password is required'
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    return null;
};