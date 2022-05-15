class Mobile {
  name;

  internal_Storage;

  RAM;

  camera;

  brand;

  constructor(obj) {
    if (!obj) {
      this.name = 'String';
      this.internal_Storage = 'String';
      this.RAM = 'String';
      this.camera = 'String';
      this.brand = 'String';
      return;
    }
    if (
      !obj ||
      !obj.name ||
      !obj.internal_Storage ||
      !obj.RAM ||
      !obj.camera ||
      !obj.brand
    )
      throw new Error('Mobile description validation error');
    this.name = obj.name;
    this.internal_Storage = obj.internal_Storage;
    this.RAM = obj.RAM;
    this.camera = obj.camera;
    this.brand = obj.brand;
  }
}

module.exports = Mobile;
