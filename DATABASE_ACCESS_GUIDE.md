# Database Access Guide

## Database Information

**Database Name:** `medplatform`
**Username:** `meduser`
**Password:** `medpassword`
**Host:** `localhost`
**Port:** `5432`

## Current Tables

- `users` - User accounts (patients, doctors, pharmacists, admins)
- `products` - Medication products
- `orders` - Customer orders
- `audit_logs` - System audit trail

## Access Methods

### 1. Command Line (psql)

**Connect to database:**
```bash
docker exec -it infrastructure-postgres-1 psql -U meduser -d medplatform
```

**Common Commands:**
```sql
-- List all tables
\dt

-- Describe table structure
\d users
\d products
\d orders

-- View all users
SELECT id, email, role, first_name, last_name FROM users;

-- View all products
SELECT id, name, price, requires_prescription, stock_quantity FROM products;

-- View all orders
SELECT id, user_id, status, total_amount, created_at FROM orders;

-- Count records
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM orders;

-- Exit psql
\q
```

**Run single query from command line:**
```bash
docker exec -it infrastructure-postgres-1 psql -U meduser -d medplatform -c "SELECT * FROM users;"
```

### 2. pgAdmin (GUI Tool)

**Download:** https://www.pgadmin.org/download/

**Setup:**
1. Install pgAdmin
2. Right-click "Servers" → "Register" → "Server"
3. General tab: Name = "AfiEl Pharma Local"
4. Connection tab:
   - Host: `localhost`
   - Port: `5432`
   - Database: `medplatform`
   - Username: `meduser`
   - Password: `medpassword`
5. Click "Save"

**Features:**
- Visual query builder
- Table data viewer/editor
- Schema designer
- Query history
- Export data to CSV/JSON

### 3. DBeaver (Free Universal Database Tool)

**Download:** https://dbeaver.io/download/

**Setup:**
1. Install DBeaver
2. Click "New Database Connection"
3. Select "PostgreSQL"
4. Enter connection details:
   - Host: `localhost`
   - Port: `5432`
   - Database: `medplatform`
   - Username: `meduser`
   - Password: `medpassword`
5. Test Connection → Finish

**Features:**
- Multi-database support
- ER diagrams
- Data export/import
- SQL editor with autocomplete
- Visual query builder

### 4. VS Code Extension

**Extension:** PostgreSQL by Chris Kolkman

**Setup:**
1. Install extension from VS Code marketplace
2. Click PostgreSQL icon in sidebar
3. Add connection:
   - Host: `localhost`
   - Port: `5432`
   - Database: `medplatform`
   - Username: `meduser`
   - Password: `medpassword`

**Features:**
- Query editor in VS Code
- Table browsing
- Query results in VS Code
- Integrated with your workflow

### 5. TablePlus (Premium but has free tier)

**Download:** https://tableplus.com/

**Features:**
- Beautiful UI
- Fast performance
- Multi-tab queries
- Data editing
- SSH tunneling support

## Useful Queries

### View Admin User
```sql
SELECT * FROM users WHERE role = 'admin';
```

### View Products with Images
```sql
SELECT id, name, price, 
       CASE WHEN image_url IS NOT NULL THEN 'Yes' ELSE 'No' END as has_image
FROM products;
```

### View Recent Orders
```sql
SELECT o.id, u.email, o.status, o.total_amount, o.created_at
FROM orders o
JOIN users u ON o.user_id = u.id
ORDER BY o.created_at DESC
LIMIT 10;
```

### Count Orders by Status
```sql
SELECT status, COUNT(*) as count
FROM orders
GROUP BY status
ORDER BY count DESC;
```

### View Products Requiring Prescription
```sql
SELECT name, price, stock_quantity
FROM products
WHERE requires_prescription = true
ORDER BY name;
```

### View User Activity
```sql
SELECT u.email, u.role, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.email, u.role
ORDER BY order_count DESC;
```

## Backup Database

**Create backup:**
```bash
docker exec infrastructure-postgres-1 pg_dump -U meduser medplatform > backup.sql
```

**Restore backup:**
```bash
docker exec -i infrastructure-postgres-1 psql -U meduser -d medplatform < backup.sql
```

## Database Maintenance

**View database size:**
```bash
docker exec -it infrastructure-postgres-1 psql -U meduser -d medplatform -c "SELECT pg_size_pretty(pg_database_size('medplatform'));"
```

**View table sizes:**
```bash
docker exec -it infrastructure-postgres-1 psql -U meduser -d medplatform -c "SELECT tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size FROM pg_tables WHERE schemaname = 'public' ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;"
```

## Security Notes

⚠️ **Important:**
- These credentials are for local development only
- Never commit database credentials to version control
- Use environment variables for production
- Change default passwords in production
- Enable SSL for production databases
- Restrict database access by IP in production

## Troubleshooting

**Can't connect?**
1. Check if Docker is running: `docker ps`
2. Check if PostgreSQL container is running: `docker ps | grep postgres`
3. Verify port 5432 is not blocked: `netstat -ano | findstr :5432`

**Connection refused?**
- Make sure Docker Desktop is running
- Restart containers: `docker-compose restart` in infrastructure folder

**Permission denied?**
- Verify username and password are correct
- Check if user has proper permissions

## Quick Reference

| Tool | Best For | Cost |
|------|----------|------|
| psql | Quick queries, scripts | Free |
| pgAdmin | Full-featured GUI | Free |
| DBeaver | Multi-database work | Free |
| VS Code Extension | Integrated workflow | Free |
| TablePlus | Beautiful UI | Free tier available |

## Current Database Status

Run this to check your database:
```bash
docker exec -it infrastructure-postgres-1 psql -U meduser -d medplatform -c "SELECT 'Users: ' || COUNT(*) FROM users UNION ALL SELECT 'Products: ' || COUNT(*) FROM products UNION ALL SELECT 'Orders: ' || COUNT(*) FROM orders;"
```
