/*
資料範例
{
  columns: ["週一", "週二", "週三", "週四", "週五"],
  rows: [
    {
      time: "08:00 - 09:00",
      classes: ["英文", "數學", "歷史", "理化", "體育"]
    }
  ]
}
*/

export type TimetableRow = {
    time: string;
    classes: string[];
}

export type TimetableData = {
    columns: string[];
    rows: TimetableRow[];
}

