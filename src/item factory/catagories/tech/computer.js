class Computer {
  hard_disk;

  RAM;

  proccessor;

  Grphical_card;

  constructor(obj) {
    if (!obj) {
      this.hard_disk = 'String';
      this.RAM = 'String';
      this.proccessor = 'String';
      this.Grphica_card = 'String';
      return;
    }
    if (
      !obj ||
      !obj.hard_disk ||
      !obj.RAM ||
      !obj.proccessor ||
      !obj.Grphical_card
    )
      throw new Error('Computer description validation error');
    this.hard_disk = obj.hard_disk;
    this.RAM = obj.RAM;
    this.proccessor = obj.proccessor;
    this.Grphical_card = obj.Grphical_card;
  }
}

module.exports = Computer;
