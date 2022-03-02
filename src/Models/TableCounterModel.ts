import { Schema, Document, model } from "mongoose";

interface ICounter {
  counter: number;
  name: string;
}

interface ICounterModel extends ICounter, Document {}

const TableSchema = new Schema({
  counter: { type: Number, required: true, default: 1000 },
  name: { type: String, required: true },
});

export const CounterModel = model<ICounterModel>("counter", TableSchema);
