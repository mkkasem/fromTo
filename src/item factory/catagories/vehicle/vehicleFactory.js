const Car = require('./Car');
const Van = require('./Van');

// error messages
const generalError = 'invalid vehicle type';

module.exports = (typeSequence, obj) => {
  const type = typeSequence[0].toString();
  // eslint-disable-next-line no-useless-catch
  try {
    switch (type) {
      case 'car':
        return new Car(obj);
      case 'van':
        return new Van(obj);
      default:
        break;
    }
  } catch (error) {
    throw error;
  }
  throw new Error(generalError);
};
