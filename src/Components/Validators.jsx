 

const validateLoginInputs = (username, password) => {
  const errors = []

  if(!username){
    errors.push('Username is required')
  }else if (username.length < 2) {
    errors.push('Username must be at least 2 characters long');
  } else if (!/^[a-zA-Z0-9]+$/.test(username)) {
    errors.push('Username can only contain alphanumeric characters');
  }

  if (!password) {
    errors.push('Password is required');
  } 

  return errors
}


const validateDetailsData = (username, fName, lName, email, pwd, cPassword, phonenumber, gender, region) => {
    const errors = []

    if(!username){
      errors.push('Username is required')
    }else if (username.length < 2) {
      errors.push('Username must be at least 2 characters long');
    } else if (!/^[a-zA-Z0-9]+$/.test(username)) {
      errors.push('Username can only contain alphanumeric characters');
    }

    if (!fName) {
      errors.push('First name is required');
    } else if (!/^[a-zA-Z]+$/.test(fName)) {
      errors.push('Last name must contain only letters');
    } else if (fName.length < 2) {
      errors.push('Last name must be at least 2 characters long');
    }

    if (!lName) {
      errors.push('First name is required');
    } else if (!/^[a-zA-Z]+$/.test(lName)) {
      errors.push('First name must contain only letters');
    } else if (lName.length < 2) {
      errors.push('First name must be at least 2 characters long');
    }

    if (!email) {
      errors.push('Email address is required');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.push('Invalid email address format');
    }

    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{":;'?/>.<,])(?=.*[a-zA-Z]).{8,}$/;

    if (!pwd) {
      errors.push('Password is required');
    } else if (!regex.test(pwd)) {
      errors.push('Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character');
    }

    if (!cPassword) {
      errors.push('Confirm Password is required');
    } else if (cPassword !== pwd) {
      errors.push("Passwords dont match")
    }

    if (!phonenumber) {
      errors.push('Phone number is required');
    } else if (!/^\d+$/.test(phonenumber)) {
      errors.push('Phone number must contain only numbers');
    }
    console.log(gender)

    if (!gender) {
      errors.push('Gender is required');
    } else if (!['male', 'female'].includes(gender.toLowerCase())) {
      errors.push('Invalid gender selection');
    }

    if (!region) {
      errors.push('Region is required');
    } else if (!/^[a-zA-Z\s]+$/.test(region)) {
      errors.push('Region must contain only letters and spaces');
    } else if (region.length < 2) {
      errors.push('Region must be at least 2 characters long');
    }

    return errors
  }



  export { validateDetailsData, validateLoginInputs }