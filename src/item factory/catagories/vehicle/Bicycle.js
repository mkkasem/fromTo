class Bicycle {
  brand;

  color;

  new;

  constructor(obj) {
    if (!obj) {
      this.brand = 'String';
      this.color = 'String';
      this.new = false;
      return;
    }
    if (!obj || !obj.brand || !obj.color || !obj.model || !obj.modelYear)
      throw new Error('Bicycle description validation error');
    this.brand = obj.brand;
    this.color = obj.color;
    this.new = obj.new;
  }
}

module.exports = Bicycle;
