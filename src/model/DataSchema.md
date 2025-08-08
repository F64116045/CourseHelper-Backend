## 1. Data Relationships

The system supports a multi-semester academic structure for each user. Each semester includes its own courses, schedule, and attendance records.

```
User
├── currentSemesterId → Semester
└── has many Semesters
     ├── has many Courses
     │    └── has many Attendance records
     └── has one TimetableData
```

- Each `User` can have multiple `Semesters`.
- The field `currentSemesterId` in `User` points to the currently active semester.
- Each `Semester` is owned by one user, and contains:
  - Multiple `Courses`
  - One `TimetableData` (weekly schedule)
- Each `Course` belongs to a `Semester` and can have multiple `Attendance` records.
- `TimetableData` is per-semester and per-user.


## 2. Data Models

### 2.1 User

```ts
{
  name: string;
  email: string;                 // unique
  password: string;
  createdAt: Date;
  currentSemesterId?: ObjectId;  // reference to active Semester
}
```

- Represents a user account.
- The `currentSemesterId` field is used to track which semester is currently selected.

---

### 2.2 Semester

```ts
{
  userId: ObjectId;              // reference to User
  name: string;                  // e.g., "Fall 2025" or "112-1"
  startDate?: Date;
  endDate?: Date;
  isArchived: boolean;
}
```

- Represents an academic term.
- Archived semesters can be hidden from default views.

---

### 2.3 Course

```ts
{
  userId: ObjectId;              // reference to User
  semesterId: ObjectId;          // reference to Semester
  name: string;                  // course name
  color?: string;                // display color (optional)
  credit: number;
  notificationsEnabled: boolean;
  type: '必修' | '選修' | '通識';  // required / elective / general
}
```

- Belongs to a user and a specific semester.
- May be referenced in a timetable or attendance records.

---

### 2.4 TimetableData

```ts
{
  userId: ObjectId;              // reference to User
  semesterId: ObjectId;          // reference to Semester
  columns: string[];             // e.g., ["Monday", "Tuesday", ...]
  rows: [
    {
      time: string;              // e.g., "08:00 - 09:00"
      classes: [
        { courseId?: ObjectId | null }  // reference to Course (optional)
      ]
    }
  ]
}
```

- Represents a weekly class schedule for a given semester.
- Each cell optionally links to a course.

---

### 2.5 Attendance

```ts
{
  courseId: ObjectId;            // reference to Course
  date: string;                  // format: YYYY-MM-DD
  status: 'present' | 'absent';
  note?: string;
}
```

- Tracks whether a user attended a course on a specific date.
- Uniquely identified by `(courseId, date)` pair.
- The semester context can be retrieved via the course.
