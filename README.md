# Fitness Calendar Web Application

This project is a **full-stack web application** built with **PHP (Laravel framework)** for the backend and **React** for the frontend.

Watch the app in action on YouTube:
https://www.youtube.com/watch?v=i5v7vhzR-g4

---

## Getting Started

### Cloning the project

- Open your terminal and navigate to the directory where you want to clone the project.
- Run the command:  
  ```bash
  git clone https://github.com/elab-development/internet-tehnologije-projekat-fitneskalendar_2020_0154.git
  ```
### Running the backend
1. Open XAMPP and start the Apache and MySQL modules.
2. Open the project in your code editor, open a terminal, and navigate to the backend folder. You can run: ```cd backend```
3. Run:```composer install```
4. Copy the environment file:```cp .env.example .env```
5. Generate the application key:```php artisan key:generate```
6. Configure your database credentials in the .env file: DB_CONNECTION, DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD
7. Run database migrations and seeders:
    - `php artisan migrate`
    - `php artisan db:seed`
8. Start the Laravel development server: ```php artisan serve```

### Running the frontend
1. Open a new terminal (separate from the one running Laravel).
2. Navigate to the frontend folder. You can run: ```cd frontend```
3. Install dependencies: ```npm install```
4. Start the React development server: ```npm start```

## About the Application

This web application implements a **role-based access control system** with three user roles:

- **Guests (unauthenticated users)**
- **Registered users**
- **Admins**

### Calendar Display

For the calendar view, the app uses the **React Big Calendar** library, which provides an interactive, customizable calendar interface with support for monthly, weekly, and daily views, as well as drag-and-drop event management.

The system recognizes the role of each user and assigns appropriate privileges accordingly.

### Guests can:

- View the calendar and all public events created by registered users or admins.
- Download public events in `.ics` format.
- View event locations on a map if location data is provided.
- Add existing events to their Google Calendar.
- View the weather forecast for any entered location.
- Register for an account to gain additional privileges as registered users.

### Registered users have all guest privileges plus:

- Ability to create private events visible only to themselves.
- Filter events by event type.
- Add and delete their own event types.
- Add both existing and their own events to Google Calendar.
- Use drag-and-drop functionality to change event dates by dragging events in the calendar.

### Admins have all privileges of registered users plus:

- View email addresses of users who created public events to contact them if needed.
- Delete public events.
- Access and manage the list of all users (edit, delete, search, sort).

---

## Features

- User registration and login  
- Viewing, creating, editing, and deleting events (public and private)  
- Downloading events as `.ics` files  
- Event filtering by type  
- Event type management  
- Email notifications for upcoming events  
- Weather forecast display for event locations  
- Map integration for event locations  
- Monthly, weekly, and daily calendar views  
- Responsive design with intuitive drag-and-drop support  

---

## Architecture

The application follows the **MVC (Model-View-Controller)** architecture.  
Laravel is used as the backend MVC framework handling data models, business logic, and API views, while React manages the frontend views and user interactions.

---

## Technologies Used

- **Backend:** PHP with Laravel  
- **Frontend:** React.js  
- **Database:** MySQL  
- **Others:** Composer, npm, XAMPP
