class TV {
  screen_size;

  brand;

  quality;

  constructor(obj) {
    if (!obj) {
      this.screen_size = 'String';
      this.brand = 'String';
      this.quality = 'String';
      return;
    }
    if (!obj || !obj.screen_size || !obj.brand || !obj.quality)
      throw new Error('TV description validation error');
    this.screen_size = obj.screen_size;
    this.brand = obj.brand;
    this.quality = obj.quality;
  }
}

module.exports = TV;
