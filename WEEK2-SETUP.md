# SDC310L 2.3 — Create the Infrastructure (Phase 2)

This package extends the original From the Farm app. All original pages, images, fonts, credits, search filters, and navigation are retained. Shopping Cart is added to the existing Menu, with Continue Shopping returning to Listings.

## Open locally

1. Copy the contents of this package into your existing FromTheFarm-main folder. Allow matching files to be replaced. Keep a backup of your current folder first.
2. With Apache running, open http://localhost/SDC310/Term%20Project/FromTheFarm-main/php/index.php
3. Use Menu → Shopping Cart. Continue Shopping opens the existing Listings page.

The ready-made build is included; Node installation is not needed to open it. The old php/styles.css is unused. Do not replace src/App.css or the original component styles with it.

## Database

Start MySQL. In phpMyAdmin, import database/FromTheFarm.sql. It creates Products, Carts, CartItems and nine products matching the existing app. Existing IDs are preserved. If your current tables have a different schema, inspect them before importing. Confirm the three tables and nine products after import.

php/db.php provides the local PDO connection framework. It is not called by the frontend yet. Week 2 still displays the original JavaScript catalog; database reads and cart mutations remain future work. No working checkout is claimed.

For the required exported SQL, after verifying your database, use phpMyAdmin Export → SQL and save that export in database/ before submission. The included SQL is a setup script, not evidence of a completed export from your machine.

## Rebuilding after source edits

From the project folder: npm ci, then npm run build:xampp.
Copy build/static to php/static, and build/index.html to php/app.html. Also copy any other build assets to php/. Keep php/index.php and php/db.php.

## Submission still needed

Capture the running original homepage and Shopping Cart screen. Update the Week 2 plan with actual completed tasks and dates. Commit source, SQL export and php build to GitHub. Create a valid Git tag such as Phase-2 (spaces are not allowed for the requested display name Phase #2); use “Phase #2 — SDC310L 2.3: Create the Infrastructure” as release title. Submit the Word plan and tag URL and ensure instructor access. Do not mark database work complete until verified locally.
