class Office {
  adress;

  floor;

  space;

  constructor(obj) {
    if (!obj) {
      this.adress = 'String';
      this.floor = new Date('1970').getFullYear();
      this.space = new Date('1970').getFullYear();
      return;
    }
    if (!obj || !obj.adress || !obj.floor || !obj.space)
      throw new Error('House description validation error');
    this.adress = obj.adress;
    this.floor = obj.floor;
    this.space = obj.space;
  }
}

module.exports = Office;
