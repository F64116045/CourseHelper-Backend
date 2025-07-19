# Self-Directed Timetable Assistant

Development in progress

## Goals

This project serves as a practical exploration of:

- Building a RESTful API with Node.js and Express
- Applying TypeScript for strong typing and code reliability
- Integrating MongoDB for data modeling and persistence
- Structuring a scalable backend using clean architecture principles

## Features (Planned)

- **Login / Register System**  
  A basic authentication system to access personalized features.

- **Self Check-In Reminders**  
  Automated notifications before each class to remind users to check in and maintain attendance habits.

- **Absence Records and Weekly Statistics**  
  Users can manually record their attendance. Weekly summaries and visual charts help track learning discipline.

- **Friend Free-Time Synchronization**  
  Automatically detect shared free periods among friends to help coordinate meetings or study groups.

- **Important Class Absence Alerts**  
  Mark important classes and receive alerts if absent to stay accountable.

- **Homework Logging and Reminders**  
  Log homework right after class and receive notifications to stay on top of tasks.

- **Make-Up Actions for Missed Classes**  
  When a class is missed, users can assign compensatory actions to help balance progress and maintain self-discipline.

To be continued...

## Project Structure

The backend is written in TypeScript and follows a modular structure:

- `controllers/` — Handles login, registration, and timetable logic
- `data/` — Contains mock timetable data
- `middleware/` — Includes authentication middleware
- `model/` — Defines user, timetable, and token-related models
- `routes/` — API route definitions
- `types/` — Shared TypeScript types
