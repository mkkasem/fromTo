const vehicle = require('./catagories/vehicle/vehicleFactory');
const realEstate = require('./catagories/real estate/realEstateFactory');
const techFactory = require('./catagories/tech/techFactory');

// error messages
const generalError = 'invalid Item type';

class ItemFactory {
  createItem(typeSequence, obj) {
    const type = typeSequence[0].toString();
    const newTypeSequence = typeSequence.splice(1);
    // eslint-disable-next-line no-useless-catch
    try {
      switch (type) {
        case 'vehicle':
          return vehicle(newTypeSequence, obj);
        case 'real estate':
          return realEstate(newTypeSequence, obj);
        case 'tech':
          return techFactory(newTypeSequence, obj);
        default:
          break;
      }
    } catch (error) {
      throw error;
    }
    throw new Error(generalError);
  }
}

module.exports = ItemFactory;
