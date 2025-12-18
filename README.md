# Studio Ghibli Filmography

A dynamic Single Page Application (SPA) that visualizes the history of Studio Ghibli films through an interactive timeline. Built with Laravel, Inertia.js, and React, this application allows users to explore the Studio Ghibli filmography, track their viewing progress, and add personalized notes to each film.

## Features

- **Timeline Visualization**: Chronological display of Studio Ghibli films from 1986 to present
- **Personal Film Tracking**: Mark films as watched, plan to watch, or currently watching
- **Note Management**: Add and edit personal notes for each film
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Performance Optimized**: Centralized API caching and efficient database queries

## Technology Stack

- **Backend**: Laravel 11.x (PHP)
- **Frontend**: React with Inertia.js
- **Styling**: Tailwind CSS with Aceternity UI components
- **Database**: MySQL
- **API**: Studio Ghibli REST API

---

## Setup Guide

### Prerequisites

Ensure you have the following installed on your system:
- PHP 8.2 or higher
- Composer
- Node.js 18.x or higher
- npm or yarn
- MySQL or PostgreSQL database

### Installation Steps

#### 1. Clone the Repository

```bash
git clone <repository-url> studio-ghibli-app
cd studio-ghibli-app
```

#### 2. Install PHP Dependencies

```bash
composer install
```

#### 3. Install Node Dependencies

```bash
npm install
```

#### 4. Configure Environment Variables

Copy the example environment file and configure your database credentials:

```bash
cp .env.example .env
```

Edit the `.env` file and update the following database settings:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password
```

Generate the application key:

```bash
php artisan key:generate
```

#### 5. Run Database Migrations

Create and seed the database tables:

```bash
php artisan migrate:fresh --seed
```

This command will:
- Drop all existing tables (if any)
- Run all migrations to create fresh tables
- Seed the database with initial data

#### 6. Start the Development Servers

You need to run **two terminal windows simultaneously**:

**Terminal 1 - Laravel Backend:**
```bash
php artisan serve
```
The backend will be available at `http://localhost:8000`

**Terminal 2 - Vite Frontend:**
```bash
npm run dev
```
The Vite dev server will compile your React components and assets

#### 7. Access the Application

Open your browser and navigate to:
```
http://localhost:8000
```

---

## Project Structure

```
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── GhibliController.php      # API integration with caching
│   │   │   └── FilmActionController.php  # User action management
│   ├── Models/
│   │   ├── FilmAction.php                # Film tracking model
│   │   └── User.php                      # User authentication model
├── resources/
│   ├── js/
│   │   ├── Components/                   # Reusable React components
│   │   ├── Pages/                        # Inertia.js page components
│   │   └── app.jsx                       # Main React entry point
│   └── css/
│       └── app.css                       # Tailwind CSS styles
├── routes/
│   ├── web.php                           # Application routes
│   └── auth.php                          # Authentication routes
└── database/
    **└── migrations/                     # Database schema definitions**

```

---

## Common Issues

### Issue: "npm run dev" fails
**Solution**: Delete `node\_modules` and `package-lock.json`, then run `npm install` again.

### Issue: Database connection error
**Solution**: Verify your `.env` database credentials match your local database setup.

### Issue: API data not loading
**Solution**: Clear Laravel cache with `php artisan cache:clear` and restart the server.

---

## License

This project is built using the Laravel framework, which is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).