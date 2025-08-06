# CourseHelper Backend (Development in progress)

A course management and scheduling backend system built with **Node.js + TypeScript + Express + MongoDB**.

---

## Development Motivation

During summer vacation while scheduling courses, I couldn't find any good and comprehensive course schedule and course management tools online, so I decided to try building one myself. The goal is to provide:

- Quick course scheduling
- Credit type management (General Education / Required / Elective)
- Complete attendance record keeping (to avoid forgetting attendance status)
- Multi-semester long-term planning
- Comprehensive statistical reports

At the same time, another main reason is to practice backend technologies:

- TypeScript / Node.js / Express
- MongoDB / Mongoose ODM
- JWT Authentication / RESTful API Design

---

## Project Directory Structure

```
src
├── config
│   └── db.ts                    # Database configuration
├── controllers                  # Controller logic
│   ├── controller.attendance.ts
│   ├── controller.courseList.ts
│   ├── controller.login.ts
│   ├── controller.register.ts
│   └── controller.timetable.ts
├── data
│   └── mockTimetable.ts        # Mock data
├── index.ts                    # Project entry point
├── middleware
│   └── authMiddleware.ts       # JWT verification middleware
├── model                       # Mongoose models
│   ├── Attendance.ts
│   ├── Course.ts
│   ├── Jwt.ts
│   ├── Timetable.ts
│   └── User.ts
├── routes                      # API routes
│   ├── attendance.route.ts
│   ├── auth.routes.ts
│   ├── timetable.routes.ts
│   └── token.ts
└── types                       # TypeScript types
    ├── express
    │   └── index.d.ts
    └── timetable.ts
```

## Completed Features

- User registration and login (JWT authentication)
- Course addition and deletion
- Timetable scheduling (click-based)
- Class attendance recording
- RESTful API architecture

## Technologies Used
- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- JWT

---

## Authentication (Auth)

### Registration

**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "TEST",
  "email": "test@example.com",
  "password": "123456"
}
```

**Response 201:**
```json
{
  "message": "Registration successful!"
}
```

### Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "alice@example.com",
  "password": "123456"
}
```

**Response 200:**
```json
{
  "token": "JWT_ACCESS_TOKEN",
  "name": "Alice",
  "email": "alice@example.com"
}
```

---

## Course Management

### Get Course List
**GET** `/course-list`

**Authorization:** `Bearer <JWT>`

**Response 200:**
```json
[
  {
    "_id": "64b8c1...",
    "userId": "64b8a2...",
    "name": "Calculus",
    "type": "Required",
    "credit": 3,
    "color": "#ffcc00",
    "notificationsEnabled": true
  }
]
```

### Add Course
**POST** `/course-list`

**Authorization:** `Bearer <JWT>`

**Request Body:**
```json
{
  "name": "Calculus",
  "type": "Required",
  "credit": 3,
  "color": "#00ccff",
  "notificationsEnabled": false
}
```

**Response 201:**
```json
{
  "_id": "64b8c3...",
  "userId": "64b8a2...",
  "name": "Calculus",
  "type": "Required",
  "credit": 3,
  "color": "#00ccff",
  "notificationsEnabled": false
}
```

### Delete Course
**DELETE** `/course-list/:id`

**Authorization:** `Bearer <JWT>`

**Response 200:**
```json
{
  "message": "Deletion successful"
}
```

### Get Course Details (with Schedule)
**GET** `/course-list/:id`

**Authorization:** `Bearer <JWT>`

**Response 200:**
```json
{
  "_id": "64b8c3...",
  "userId": "64b8a2...",
  "name": "Data Structures",
  "type": "Required",
  "credit": 3,
  "color": "#00ccff",
  "schedule": [
    { "day": "Mon", "time": "08:10" },
    { "day": "Wed", "time": "10:10" }
  ]
}
```

---

## Attendance Management

### Mark Attendance
**POST** `/attendance/mark`

**Authorization:** `Bearer <JWT>`

**Request Body:**
```json
{
  "courseId": "64b8c3...",
  "status": "present",
  "date": "2025-08-06"
}
```

**Response 201:**
```json
{
  "courseId": "64b8c3...",
  "date": "2025-08-06",
  "status": "present"
}
```

**Error Responses:**
- **422** – Missing required fields or format error
- **404** – Course not found
- **403** – No permission
- **422** – Cannot mark attendance for future dates
- **400** – Already marked attendance for today

### Get Course Attendance History

**GET** `/attendance/history?courseId=<id>&from=2025-08-01&to=2025-08-06`

**Authorization:** `Bearer <JWT>`

**Response 200:**
```json
[
  { "date": "2025-08-06", "status": "present" },
  { "date": "2025-08-05", "status": "absent" }
]
```

---

## Timetable Management

### Get Timetable
**GET** `/timetable`

**Authorization:** `Bearer <JWT>`

**Response 200:**
```json
{
  "userId": "64b8a2...",
  "columns": ["Mon", "Tue", "Wed", "Thu", "Fri"],
  "rows": [
    { "time": "08:10", "classes": [ { "courseId": "..." }, ... ] }
  ]
}
```

### Update Timetable
**POST** `/timetable`

**Authorization:** `Bearer <JWT>`

**Request Body:**
```json
{
  "columns": ["Mon", "Tue", "Wed", "Thu", "Fri"],
  "rows": [
    {
      "time": "08:10",
      "classes": [ { "courseId": "64b8c3..." }, { "courseId": null } ]
    }
  ]
}
```

**Response 200:**
```json
{
  "message": "Timetable updated successfully"
}
```

---

## HTTP Status Codes

- **200** – Success
- **201** – Created successfully
- **400** – Bad request (format error or missing parameters)
- **401** – Unauthorized (missing JWT)
- **403** – Forbidden (no permission)
- **404** – Resource not found
- **422** – Data validation failed (e.g., future date attendance)
- **500** – Server error
