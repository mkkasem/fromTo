const Car = require('./items classes/Car');
const Statment = require('./items classes/Statment');

// error messages
const generalError = 'you did not specify a valid Item type';

class ItemFactory {
  createItem(type, obj) {
    try {
      switch (type) {
        case 'car':
          return new Car(obj);
        case 'statment':
          return new Statment(obj);
        default:
          break;
      }
    } catch (error) {
      throw new Error(error);
    }
    throw new Error(generalError);
  }
}

module.exports = ItemFactory;
