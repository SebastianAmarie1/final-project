const {
    validateLoginInputs,
    validateDetailsData,
    validateProfileDetailsData,
    validateProfileData,
    validateMessageData
  } = require('./Validators');
  
  describe('Validation Functions', () => {
    test('validateLoginInputs', () => {
      const username = 'User123';
      const password = 'Pass123!';
  
      const errors = validateLoginInputs(username, password);
      expect(errors.length).toBe(0);
    });
  
    test('validateDetailsData', () => {
      const username = 'User123';
      const fName = 'John';
      const lName = 'Doe';
      const email = 'john.doe@example.com';
      const pwd = 'Pass123!';
      const cPassword = 'Pass123!';
      const phonenumber = '1234567890';
      const gender = 'male';
      const region = 'California';
  
      const errors = validateDetailsData(username, fName, lName, email, pwd, cPassword, phonenumber, gender, region);
      expect(errors.length).toBe(0);
    });
  
    test('validateProfileDetailsData', () => {
      const fName = 'John';
      const lName = 'Doe';
      const email = 'john.doe@example.com';
      const phonenumber = '1234567890';
      const region = 'California';
  
      const errors = validateProfileDetailsData(fName, lName, email, phonenumber, region);
      expect(errors.length).toBe(0);
    });
  
    test('validateProfileData', () => {
      const bio = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
      const hobbie1 = 'Reading';
      const hobbie2 = 'Traveling';
      const hobbie3 = 'Gardening';
      const fact1 = 'I have visited 20 countries';
      const fact2 = 'I can speak 4 languages';
      const lie = 'I have met Barack Obama';
  
      const errors = validateProfileData(bio, hobbie1, hobbie2, hobbie3, fact1, fact2, lie);
      expect(errors.length).toBe(0);
    });
  
    test('validateMessageData', () => {
      const inputMessage = 'Hello, how are you?';
  
      const errors = validateMessageData(inputMessage);
      expect(errors.length).toBe(0);
    });
  });

/*
    Tests login input validator
    Tests details data validator
    Tests profile data validator
    Tests messages validator
*/