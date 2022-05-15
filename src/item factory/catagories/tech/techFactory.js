const Computer = require('./computer');
const Mobile = require('./mobile');
const TV = require('./tv');

// error messages
const generalError = 'invalid real estate type';

module.exports = (typeSequence, obj) => {
  const type = typeSequence[0].toString();
  // eslint-disable-next-line no-useless-catch
  try {
    switch (type) {
      case 'computer':
        return new Computer(obj);
      case 'mobile':
        return new Mobile(obj);
      case 'tv':
        return new TV(obj);
      default:
        break;
    }
  } catch (error) {
    throw error;
  }
  throw new Error(generalError);
};
