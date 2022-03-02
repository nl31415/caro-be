import { Schema, Document, model } from "mongoose";
import { IsString, MinLength, MaxLength, IsBoolean } from "class-validator";

export interface ITable {
  tableName: string;
  index: number;
  member: {
    _id: string;
    username: string;
    score: number;
    playerType: number;
    avatar: number;
  }[];
  status: "watting" | "full";
  private: boolean;
  password?: string;
  createAt: number;
  updateAt: number;
  matchHistory: { _id: string; position: number }[];
}

interface ITableModel extends ITable, Document {}

// Export schema database
const TableMemberSchema = new Schema({
  username: String,
  _id: String,
  avatar: Number,
  score: Number,
  playerType: Number,
});

const MatchHistorySchema = new Schema({
  _id: String,
  position: Number,
});

const TableSchema = new Schema({
  tableName: { type: String, required: true },
  member: { type: [TableMemberSchema], required: true },
  status: { type: String, required: true, default: "watting" },
  private: { type: Boolean, required: true, default: false },
  password: { type: String },
  createAt: { type: Number, default: Date.now() },
  updateAt: { type: Number, default: Date.now() },
  matchHistory: { type: [MatchHistorySchema], default: [] },
  index: { type: Number },
});

export const TableModel = model<ITableModel>("tables", TableSchema);

// VALIDATOR
export class TableCreateBody {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  public password!: string;

  @IsString()
  public tableName!: string;
}
