# SDC310L 3.3 Adding Database Support

The original From the Farm interface now connects to a PHP JSON service when opened through XAMPP. Listings read the five products in the exported database. Product photographs, categories and supplier presentation remain mapped from the existing interface assets. Prices, descriptions, names, stock and cart quantities come from MySQL.

## Run the database version

Use the current repository files under XAMPP htdocs. Start Apache and MySQL. If FromTheFarm already has the Week 2 tables and sample products, no database changes or reimport are needed. For a fresh setup, create the FromTheFarm database in phpMyAdmin, select it, and import the existing root FromTheFarm.sql export. Do not import into an already populated database.

Open php/index.php through localhost, not by double-clicking the file. In the existing folder this is:

http://localhost/SDC310/Term%20Project/FromTheFarm-main/php/index.php

php/db.php defaults to 127.0.0.1:3306, database FromTheFarm, root, blank password for local XAMPP. Set FTF_DB_HOST, FTF_DB_PORT, FTF_DB_NAME, FTF_DB_USER and FTF_DB_PASSWORD for another installation. Never commit real passwords. PHP needs PDO MySQL and sessions enabled. This change was tested with PHP 8.4 and MariaDB 11.8; it uses syntax compatible with PHP 8.2.

## What changed

- php/api.php reads products and session-owned cart items.
- Add to Cart creates a cart and inserts an item or updates an existing quantity.
- Quantity buttons update rows; Remove or quantity zero deletes a row.
- Check Out deletes the current cart contents and returns to Listings. No payment is collected.
- Product prices are read from the database, never accepted from the browser. Totals use integer cents, 5% tax and shipping at 10% of subtotal, rounded to the nearest cent.
- Prepared statements bind user data; session ownership keeps cart IDs off the public API. POST changes require a session CSRF token. Invalid, negative, fractional or excessive quantities are rejected. Stock is not reserved or decremented by the simulated course checkout.
- Database errors show an actionable message and Retry, without exposing credentials or SQL.

## GitHub Pages preview

https://jadesthedev.github.io/FromTheFarm/

GitHub Pages cannot execute PHP. On github.io only, the interface runs an explicitly labelled interactive browser preview. Its cart uses browser local storage; it is not evidence of MySQL persistence. All other hosts use PHP and show errors if the service is unavailable. The earlier Railway static server will also need PHP hosting to use the database version.

## Rebuild from GitHub source

Run npm ci and npm run build:xampp. The packaging script copies the newly built interface into php/app.html and php/static, leaving backend source intact. The repository includes the compiled files so the checked-out XAMPP copy can run without rebuilding. No new project or replacement interface is needed.

## Database structure

The Products, Carts and CartItems schema is unchanged. The existing SQL export remains valid. No structural migration is required for Week 3. The original nine-item browser demo remains available on Pages, while the database version lists the five seeded SQL products.

## Validation

See tests/api_integration.py and VALIDATION-WEEK3.md. The tests ran in a disposable environment, not against the student's local installation. The local XAMPP copy must receive the committed changes to run the updated backend.
