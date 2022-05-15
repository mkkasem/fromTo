const Car = require('./Car');
const Van = require('./Van');
const Bicycle = require('./Bicycle');
const Motorcycle = require('./Motorcycle');

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
      case 'bicycle':
        return new Bicycle(obj);
      case 'motorcycle':
        return new Motorcycle(obj);
      default:
        break;
    }
  } catch (error) {
    throw error;
  }
  throw new Error(generalError);
};
