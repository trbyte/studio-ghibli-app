# Database Setup Guide

This guide will help you set up the database with migrations, seeders, and export your PostgreSQL data for team sharing.

## Prerequisites

- PostgreSQL installed and running
- Laravel project configured
- Database credentials set in `.env` file

## Step 1: Configure Database Connection

Update your `.env` file to use PostgreSQL:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=studio_ghibli
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

## Step 2: Run Migrations

Create all database tables:

```bash
php artisan migrate
```

This will create:
- `users` table
- `film_actions` table
- Other Laravel default tables (sessions, cache, jobs, etc.)

## Step 3: Seed the Database

Populate the database with sample data:

```bash
php artisan db:seed
```

Or seed only the film actions:

```bash
php artisan db:seed --class=FilmActionSeeder
```

## Step 4: Export Your PostgreSQL Data

### Option A: Export All Data (Recommended for Team Sharing)

Export the entire database:

```bash
pg_dump -U your_username -d studio_ghibli -F c -f studio_ghibli_backup.dump
```

Or export as SQL file:

```bash
pg_dump -U your_username -d studio_ghibli -f studio_ghibli_backup.sql
```

### Option B: Export Specific Tables

Export only the `film_actions` table:

```bash
pg_dump -U your_username -d studio_ghibli -t film_actions -f film_actions_backup.sql
```

Export multiple tables:

```bash
pg_dump -U your_username -d studio_ghibli -t users -t film_actions -f user_data_backup.sql
```

### Option C: Export as CSV (For Data Analysis)

Export `film_actions` table as CSV:

```bash
psql -U your_username -d studio_ghibli -c "\COPY film_actions TO 'film_actions.csv' DELIMITER ',' CSV HEADER;"
```

## Step 5: Import Data (For Teammates)

### Import from Dump File

```bash
pg_restore -U your_username -d studio_ghibli studio_ghibli_backup.dump
```

### Import from SQL File

```bash
psql -U your_username -d studio_ghibli -f studio_ghibli_backup.sql
```

### Import from CSV

```bash
psql -U your_username -d studio_ghibli -c "\COPY film_actions FROM 'film_actions.csv' DELIMITER ',' CSV HEADER;"
```

## Step 6: Verify Data

Check that your data was imported correctly:

```bash
psql -U your_username -d studio_ghibli -c "SELECT COUNT(*) FROM film_actions;"
```

## Database Schema

### film_actions Table

```sql
CREATE TABLE film_actions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    film_id VARCHAR(255) NOT NULL,
    film_title VARCHAR(255) NOT NULL,
    action_type VARCHAR(20) NOT NULL CHECK (action_type IN ('favorite', 'plan', 'on_hold', 'dropped', 'finished')),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    UNIQUE(user_id, film_id, action_type)
);
```

## Troubleshooting

### Connection Issues

If you get connection errors:
1. Verify PostgreSQL is running: `pg_isready`
2. Check your `.env` credentials
3. Ensure the database exists: `psql -U your_username -l`

### Permission Issues

If you get permission errors:
```bash
# Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE studio_ghibli TO your_username;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_username;
```

### Migration Issues

If migrations fail:
```bash
# Reset and re-run migrations (WARNING: This will delete all data)
php artisan migrate:fresh
php artisan migrate
php artisan db:seed
```

## Best Practices

1. **Always backup before migrations**: Export your data before running `migrate:fresh`
2. **Use version control for migrations**: Commit migration files to Git
3. **Don't commit seeders with real user data**: Keep seeders generic
4. **Document schema changes**: Update this file when adding new tables/columns

## Quick Reference Commands

```bash
# Create migration
php artisan make:migration create_table_name

# Run migrations
php artisan migrate

# Rollback last migration
php artisan migrate:rollback

# Create seeder
php artisan make:seeder SeederName

# Run seeders
php artisan db:seed

# Export PostgreSQL database
pg_dump -U username -d database_name -f backup.sql

# Import PostgreSQL database
psql -U username -d database_name -f backup.sql
```

