const forRent = require('./forRentFactory');
const forSale = require('./forSaleFactory');

// error messages
const generalError = 'invalid real estate type';

module.exports = (typeSequence, obj) => {
  const type = typeSequence[0].toString();
  const newTypeSequence = typeSequence.splice(1);
  // eslint-disable-next-line no-useless-catch
  try {
    switch (type) {
      case 'for rent':
        return forRent(newTypeSequence, obj);
      case 'for sale':
        return forSale(newTypeSequence, obj);
      default:
        break;
    }
  } catch (error) {
    throw error;
  }
  throw new Error(generalError);
};
