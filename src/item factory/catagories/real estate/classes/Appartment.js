class Appartment {
  adress;

  floor;

  room;

  space;

  buildingAge;

  constructor(obj) {
    if (!obj) {
      this.adress = 'String';
      this.floor = new Date('1970').getFullYear();
      this.room = new Date('1970').getFullYear();
      this.space = new Date('1970').getFullYear();
      this.buildingAge = new Date('1970').getFullYear();
      return;
    }
    if (
      !obj ||
      !obj.adress ||
      !obj.floor ||
      !obj.room ||
      !obj.space ||
      !obj.buildingAge
    )
      throw new Error('House description validation error');
    this.adress = obj.adress;
    this.floor = obj.floor;
    this.room = obj.room;
    this.space = obj.space;
    this.buildingAge = obj.buildingAge;
  }
}

module.exports = Appartment;
