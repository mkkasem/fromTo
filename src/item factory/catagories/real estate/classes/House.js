class House {
  adress;

  room;

  space;

  buildingAge;

  constructor(obj) {
    if (!obj) {
      this.adress = 'String';
      this.room = 'String';
      this.space = 'String';
      this.buildingAge = 'String';
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
