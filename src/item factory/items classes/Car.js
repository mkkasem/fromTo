class Car {
  brand;

  color;

  name;

  modelYear;

  statue;

  constructor(obj) {
    if (!obj || !obj.brand || !obj.color || !obj.name || !obj.modelYear)
      throw new Error('car description validation error');
    this.brand = obj.brand;
    this.color = obj.color;
    this.name = obj.name;
    this.modelYear = obj.modelYear;
    this.statue = obj.statue;
  }
}

module.exports = Car;
