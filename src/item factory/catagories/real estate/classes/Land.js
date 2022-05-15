class Land {
  adress;

  space;

  constructor(obj) {
    if (!obj) {
      this.adress = 'String';
      this.space = 'String';
      return;
    }
    if (!obj || !obj.adress || !obj.space)
      throw new Error('Land description validation error');
    this.adress = obj.adress;
    this.space = obj.space;
  }
}

module.exports = Land;
