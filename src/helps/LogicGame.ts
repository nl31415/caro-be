import { TableModel } from "../Models/TableModel";

export const checkLogicGame = (table: any) => {
  let history = table.matchHistory;
  let playerX = history[0]._id;
  let playerO = history[1]._id;

  console.log("asdasd");
  let listCheckedX: Array<{ _id: string; position: number }> = [];
  let listCheckedO: Array<{ _id: string; position: number }> = [];

  table.matchHistory.forEach((e: any, i: any) => {
    if (i % 2 === 0) {
      listCheckedX.push(e);
    } else {
      listCheckedO.push(e);
    }
  });

  let checkX = listCheckedX
    .map((e) => {
      return e.position;
    })
    .sort();

  let checkXWin = checkWin(checkX);
  if (checkXWin) {
    return {
      win: playerX,
      arr: checkXWin,
    };
  }

  let checkO = listCheckedX
    .map((e) => {
      return e.position;
    })
    .sort();

  let checkOWin = checkWin(checkO);
  if (checkOWin) {
    return {
      win: playerO,
      arr: checkOWin,
    };
  }

  return false;
};

export const checkWin = (arrNumber: number[]) => {
  let arrCheck = arrNumber.sort((a, b) => a - b);
  let arr: any = [];
  for (let i = 0; i < arrCheck.length; i++) {
    let arrH: any = [arrCheck[i]];
    let arrV: any = [arrCheck[i]];
    let arrC1: any = [arrCheck[i]];
    let arrC2: any = [arrCheck[i]];

    // chieu ngang
    for (let j = 0; j < arrCheck.length; j++) {
      if (arrCheck.includes(arrH[j] + 1)) {
        arrH.push(arrH[j] + 1);
      } else {
        break;
      }
    }

    if (arrH.length >= 5) {
      let row = Math.floor(arrH[0] / 24);
      let count = 0;
      arrH.forEach((e: any) => {
        if (Math.floor(e / 24) === row) {
          count++;
        }
      });
      if (count >= 5) {
        // return arrH;
        arr = [...arr, ...arrH];
      }
    }

    // chieu doc
    for (let j = 0; j < arrCheck.length; j++) {
      if (arrCheck.includes(arrV[j] + 24)) {
        arrV.push(arrV[j] + 24);
      } else {
        break;
      }
    }

    if (arrV.length >= 5) {
      arr = [...arr, ...arrV];
      // return arrV;
    }

    // cheo phai -> trai
    for (let j = 0; j < arrCheck.length; j++) {
      if (arrCheck.includes(arrC1[j] + 25)) {
        arrC1.push(arrC1[j] + 25);
      } else {
        break;
      }
    }

    if (arrC1.length >= 5) {
      arr = [...arr, ...arrC1];
      // return arrC1;
    }

    // cheo trai -> phai
    for (let j = 0; j < arrCheck.length; j++) {
      if (arrCheck.includes(arrC2[j] + 23)) {
        arrC2.push(arrC2[j] + 23);
      } else {
        break;
      }
    }

    if (arrC2.length >= 5) {
      arr = [...arr, ...arrC2];
      // return arrC2;
    }
  }
  if (arr.length !== 0) {
    return Array.from(new Set(arr));
  }
  // return arr;
  return false;
};
