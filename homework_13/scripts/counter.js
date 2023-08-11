class Counter {
  constructor() {
    this.consumeAmount = 0;
    this.produceAmount = 0;
  }

  incrementConsumeAmount() {
    this.consumeAmount++;
  }

  incrementProduceAmount() {
    this.produceAmount++;
  }

  getResult() {
    return {
      consumeAmount: this.consumeAmount,
      produceAmount: this.produceAmount,
    };
  }
}

module.exports = Counter;
