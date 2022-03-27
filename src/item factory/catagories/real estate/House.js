class House {
  adress;

  floor;

  room;

  space;

  buildingAge;

  constructor(obj) {
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

module.exports = House;
