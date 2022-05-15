class House {
  adress;

  room;

  space;

  buildingAge;

  constructor(obj) {
    if (!obj) {
      this.adress = 'String';
      this.room = new Date('1970').getFullYear();
      this.space = new Date('1970').getFullYear();
      this.buildingAge = new Date('1970').getFullYear();
      return;
    }
    if (!obj || !obj.adress || !obj.room || !obj.space || !obj.buildingAge)
      throw new Error('House description validation error');
    this.adress = obj.adress;
    this.room = obj.room;
    this.space = obj.space;
    this.buildingAge = obj.buildingAge;
  }
}

module.exports = House;
