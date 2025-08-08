## 2. Data Models

### 2.1 User

```ts
{
  name: string;
  email: string;     // unique
  password: string;
  createdAt: Date;
}
```

- Represents a user account.
- Email is unique and used for authentication.

---

### 2.2 Course

```ts
{
  userId: ObjectId;            // reference to User
  name: string;                // course name
  color?: string;              // display color (optional)
  credit: number;
  notificationsEnabled: boolean;
  type: '必修' | '選修' | '通識';  // required/elective/general
}
```

- Belongs to a user.
- `type` is an enum representing course category.
- May be referenced in timetable or attendance records.

---

### 2.3 TimetableData

```ts
{
  userId: ObjectId;        // reference to User
  columns: string[];       // e.g., ["Monday", "Tuesday", ...]
  rows: [
    {
      time: string;        // e.g., "08:00 - 09:00"
      classes: [
        { courseId?: ObjectId | null }  // reference to Course or null
      ]
    }
  ]
}
```

- Represents a user's weekly schedule.
- `columns` define the days of the week.
- `rows` represent time slots, with each class slot optionally linking to a course.

---

### 2.4 Attendance

```ts
{
  courseId: ObjectId;              // reference to Course
  date: string;                    // format: YYYY-MM-DD
  status: 'present' | 'absent';    // attendance status
  note?: string;                   // optional remark
}
```

- Unique by combination of `courseId` and `date`.
- Tracks if a student attended a specific course on a given day.
