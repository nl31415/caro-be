import { Schema, Document, model } from "mongoose";
import {
  IsString,
  Min,
  Max,
  IsInt,
  Matches,
  MinLength,
  MaxLength,
} from "class-validator";

interface IUser {
  username: string;
  password: string;
  playHistory: {
    totalGame: number;
    winGame: number;
    loseGame: number;
    drawGame: number;
  };
  avatar: number;
  token: string;
  createdAt: number;
  updatedAt: number;
}

interface IUserModel extends IUser, Document {}

const PlayHistorySchema = new Schema({
  totalGame: { type: Number, required: true, default: 0 },
  winGame: { type: Number, required: true, default: 0 },
  loseGame: { type: Number, required: true, default: 0 },
  drawGame: { type: Number, required: true, default: 0 },
});

// Export schema database
const UserSchema = new Schema({
  username: { type: String, required: true, maxlength: 20, minlength: 3 },
  password: { type: String, required: true },
  playHistory: {
    totalGame: { type: Number, required: true, default: 0 },
    winGame: { type: Number, required: true, default: 0 },
    loseGame: { type: Number, required: true, default: 0 },
    drawGame: { type: Number, required: true, default: 0 },
  },
  avatar: { type: Number, required: true },
  token: { type: String, default: "0" },
});

export const UserModel = model<IUserModel>("users", UserSchema);

// VALIDATOR
export class UserCreateBody {
  @IsString()
  public username!: string;

  @IsString()
  // @MinLength(4)
  // @MaxLength(20)
  // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //   message: "password too weak",
  // })
  public password!: string;

  @IsInt()
  @Min(0)
  @Max(3)
  public avatar!: number;
}
