const House = require('./classes/House');
const Land = require('./classes/Land');
const Apartment = require('./classes/Appartment');
const Office = require('./classes/Office');

// error messages
const generalError = 'invalid for rent type';

module.exports = (typeSequence, obj) => {
  const type = typeSequence[0].toString();
  // eslint-disable-next-line no-useless-catch
  try {
    switch (type) {
      case 'house':
        return new House(obj);
      case 'land':
        return new Land(obj);
      case 'apartment':
        return new Apartment(obj);
      case 'office':
        return new Office(obj);
      default:
        break;
    }
  } catch (error) {
    throw error;
  }
  throw new Error(generalError);
};
