const House = require('./House');
const Land = require('./Land');

// error messages
const generalError = 'invalid real estate type';

module.exports = (typeSequence, obj) => {
  const type = typeSequence[0].toString();
  // eslint-disable-next-line no-useless-catch
  try {
    switch (type) {
      case 'house':
        return new House(obj);
      case 'land':
        return new Land(obj);
      default:
        break;
    }
  } catch (error) {
    throw error;
  }
  throw new Error(generalError);
};
