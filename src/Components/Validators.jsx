
const linkify = require('linkifyjs');
const urlValidation = require('url-validation');
const Filter = require('bad-words');
const filter = new Filter();

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
    } if (!/^[a-zA-Z0-9\s.,!?:]+$/.test(username)) {
      errors.push('Username can only contain alphanumeric characters');
    } else if (username.length > 30){
      errors.push('Username must be smaller than 30 characters');
    } else if (filter.isProfane(username)) {
      errors.push('Username contains inappropriate language');
    }

    if (!fName) {
      errors.push('First name is required');
    } else if (!/^[a-zA-Z]+$/.test(fName)) {
      errors.push('First name must contain only letters');
    } else if (fName.length < 2) {
      errors.push('First name must be at least 2 characters long');
    } else if (fName.length > 30){
      errors.push('First Name must be smaller than 30 characters');
    } else if (filter.isProfane(fName)) {
      errors.push('First Name contains inappropriate language');
    }

    if (!lName) {
      errors.push('Last name is required');
    } else if (!/^[a-zA-Z]+$/.test(lName)) {
      errors.push('Last name must contain only letters');
    } else if (lName.length < 2) {
      errors.push('Last name must be at least 2 characters long');
    } else if (lName.length > 30){
      errors.push('Last Name must be smaller than 30 characters');
    } else if (filter.isProfane(lName)) {
      errors.push('Last Name contains inappropriate language');
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
    } else if (region.length > 30){
      errors.push('Region must be smaller than 30 characters');
    } else if (filter.isProfane(region)) {
      errors.push('Region contains inappropriate language');
    }

    return errors
  }

  const validateProfileDetailsData = (fName, lName, email, phonenumber, region) => {

    const errors = []

    if (!fName) {
      errors.push('First name is required');
    } else if (!/^[a-zA-Z]+$/.test(fName)) {
      errors.push('First name must contain only letters');
    } else if (fName.length < 2) {
      errors.push('First name must be at least 2 characters long');
    } else if (fName.length > 30){
      errors.push('First Name must be smaller than 30 characters');
    } else if (filter.isProfane(fName)) {
      errors.push('First Name contains inappropriate language');
    }

    if (!lName) {
      errors.push('Last name is required');
    } else if (!/^[a-zA-Z]+$/.test(lName)) {
      errors.push('Last name must contain only letters');
    } else if (lName.length < 2) {
      errors.push('Last name must be at least 2 characters long');
    } else if (lName.length > 30){
      errors.push('Last Name must be smaller than 30 characters');
    } else if (filter.isProfane(lName)) {
      errors.push('Last Name contains inappropriate language');
    }

    if (!email) {
      errors.push('Email address is required');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.push('Invalid email address format');
    } 

    if (!phonenumber) {
      errors.push('Phone number is required');
    } else if (!/^\d+$/.test(phonenumber)) {
      errors.push('Phone number must contain only numbers');
    } 

    if (!region) {
      errors.push('Region is required');
    } else if (!/^[a-zA-Z0-9\s]+$/.test(region)) {
      errors.push('Region must contain only letters and spaces');
    } else if (region.length < 2) {
      errors.push('Region must be at least 2 characters long');
    } else if (region.length > 30){
      errors.push('Region must be smaller than 30 characters');
    } else if (filter.isProfane(region)) {
      errors.push('Region contains inappropriate language');
    }

    return errors
  }

  const validateProfileData = (bio, hobbie1, hobbie2, hobbie3, fact1, fact2, lie) => {

    const errors = []

    if (bio) {
      if (!/^[a-zA-Z0-9\s.,!?:]+$/.test(bio)) {
        errors.push('Bio can only contain alphanumeric characters, numbers, !,.,,,?,:');
      } else if (bio.length < 20 && bio.length !== 0) {
        errors.push('Bio must be at least 20 characters long or empty');
      } else if (bio.length > 255){
        errors.push('Bio must be smaller than 255 characters');
      } else if (filter.isProfane(bio)) {
        errors.push('Bio contains inappropriate language');
      }
    }
    
    if(hobbie1){
      if (!/^[a-zA-Z0-9\s.,!?:]+$/.test(hobbie1)) {
        errors.push('Hobbie 1 must contain only letters, numbers, !,.,,,?,:');
      } else if (hobbie1.length < 3 && hobbie1.length !== 0) {
        errors.push('Hobbie 1 must be at least 3 characters long or empty');
      } else if (hobbie1.length > 60){
        errors.push('Hobbie 1 must be smaller than 60 characters');
      } else if (filter.isProfane(hobbie1)) {
        errors.push('Hobbie 1 contains inappropriate language');
      }
    }
    if(hobbie2){
      if (!/^[a-zA-Z0-9\s.,!?:]+$/.test(hobbie2)) {
        errors.push('Hobbie 2 must contain only letters, numbers, !,.,,,?,:');
      } else if (hobbie2.length < 3 && hobbie2.length !== 0) {
        errors.push('Hobbie 2 must be at least 3 characters long or empty');
      } else if (hobbie2.length > 60){
        errors.push('Hobbie 2 must be smaller than 60 characters');
      } else if (filter.isProfane(hobbie2)) {
        errors.push('Hobbie 2 contains inappropriate language');
      }
    }
    if(hobbie3){
      if (!/^[a-zA-Z0-9\s.,!?:]+$/.test(hobbie3)) {
        errors.push('Hobbie 3 must contain only letters, numbers, !,.,,,?,:');
      } else if (hobbie3.length < 3 && hobbie3.length !== 0) {
        errors.push('Hobbie 3 must be at least 3 characters long or empty');
      } else if (hobbie3.length > 60){
        errors.push('Hobbie 3 must be smaller than 60 characters');
      } else if (filter.isProfane(hobbie3)) {
        errors.push('Hobbie 3 contains inappropriate language');
      }
    }

    if(fact1){
      if (!/^[a-zA-Z0-9\s.,!?:]+$/.test(fact1)) {
        errors.push('Fact 1 must contain only letters, numbers, !,.,,,?,:');
      } else if (fact1.length < 3 && fact1.length !== 0) {
        errors.push('Fact 1 must be at least 3 characters long or empty');
      } else if (fact1.length > 60){
        errors.push('Fact 1 must be smaller than 60 characters');
      } else if (filter.isProfane(fact1)) {
        errors.push('Fact 1 contains inappropriate language');
      }
    }
    if(fact2){
      if (!/^[a-zA-Z0-9\s.,!?:]+$/.test(fact2)) {
        errors.push('Fact 2 must contain only letters, numbers, !,.,,,?,:');
      } else if (fact2.length < 3 && fact2.length !== 0) {
        errors.push('Fact 2 must be at least 3 characters long or empty');
      } else if (fact2.length > 60){
        errors.push('Fact 2 must be smaller than 60 characters');
      } else if (filter.isProfane(fact2)) {
        errors.push('Fact 2 contains inappropriate language');
      }
    }
    if(lie){
      if (!/^[a-zA-Z0-9\s.,!?:]+$/.test(lie)) {
        errors.push('Lie must contain only letters, numbers, !,.,,,?,:');
      } else if (lie.length < 3 && lie.length !== 0) {
        errors.push('Lie must be at least 3 characters long or empty');
      } else if (lie.length > 60){
        errors.push('Lie must be smaller than 60 characters');
      } else if (filter.isProfane(lie)) {
        errors.push('Lie contains inappropriate language');
      }
    }

    return errors
  }

  const validateMessageData = (inputMessage) => {

    const errors = []

    if (!inputMessage) {
      errors.push('Message is required');
    } else if (inputMessage.length < 1 || inputMessage.length > 255) {
      errors.push('Message must be between 1 and 255 characters long');
    } else if (filter.isProfane(inputMessage)) {
      errors.push('Message contains inappropriate language');
    }

    const urls = linkify.find(inputMessage);

    urls.forEach(url => {
      if (!urlValidation(url.href)) {
        errors.push(`Invalid URL: ${url.href}`);
      }
    });

    return errors
  }



  export { validateDetailsData, validateLoginInputs, validateProfileDetailsData, validateProfileData, validateMessageData }