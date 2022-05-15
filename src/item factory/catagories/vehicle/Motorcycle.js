class Motorcycle {
  brand;

  color;

  model;

  modelYear;

  new;

  constructor(obj) {
    if (!obj) {
      this.brand = 'String';
      this.color = 'String';
      this.model = 'String';
      this.modelYear = new Date('1970').getFullYear();
      this.new = false;
      return;
    }
    if (!obj || !obj.brand || !obj.color || !obj.model || !obj.modelYear)
      throw new Error('Motorcycle description validation error');
    this.brand = obj.brand;
    this.color = obj.color;
    this.model = obj.model;
    this.modelYear = obj.modelYear;
    this.new = obj.new;
  }
}

module.exports = Motorcycle;
