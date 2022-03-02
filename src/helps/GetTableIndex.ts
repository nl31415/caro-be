import { CounterModel } from "../Models/TableCounterModel";

export const getTableIndex = async () => {
  let counter = await CounterModel.findOne({ name: "counterId" });
  if (counter) {
    counter.counter += 1;
    await counter?.save();
    return counter.counter;
  }
  return Math.floor(Math.random() * 10000);
};
