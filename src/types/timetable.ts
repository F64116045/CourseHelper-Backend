/*
{
  "columns": ["週一", "週二", "週三", "週四", "週五"],
  "rows": [
    {
      "time": "08:00 - 09:00",
      "classes": [
        { "name": "英文", "color": "#FFAABB" },
        { "name": "數學", "color": "#66CCFF" },
        { "name": "歷史", "color": "#00FF88" },
        { "name": "理化" },
        { "name": "體育" }
      ]
    }
  ]
}
*/
export type ClassItem = {
    className: string;
    color?: string;
}

export type TimetableRow = {
    time: string;
    classes: ClassItem[];
}

export type TimetableData = {
    columns: string[];
    rows: TimetableRow[];
}

