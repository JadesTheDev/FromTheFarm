# From the Farm

From the Farm is a community-focused React application designed to help users discover local farms, farmers' markets, seasonal produce, local food, and agricultural events.

## Authors
- Jade Powell
- Holly Hebert
- Patrick Gonzalez


## Live Application

[View From the Farm — current interface preview](https://jadesthedev.github.io/FromTheFarm/)\n\nThe GitHub Pages preview includes the original interface and the Week 2 shopping cart page framework. PHP and MySQL run locally through XAMPP; GitHub Pages hosts the interface only.\n\n[Earlier Railway deployment](https://fromthefarm-production.up.railway.app)

## Features

- Browse local food listings
- Search products and suppliers
- Discover nearby farms and markets
- Explore suppliers using an interactive map
- View seasonal growing guidance
- Read local farm and community updates
- View and edit a user profile
- Responsive desktop and mobile layouts

## Technology

- React
- JavaScript
- JSX
- CSS
- React Icons
- Google Maps embeds
- Railway
- GitHub

## Project Structure

```text
FromTheFarm/
├── public/
├── src/
│   ├── assets/
│   │   ├── brand/
│   │   └── products/
│   ├── components/
│   ├── data/
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── index.js
├── .gitignore
├── package.json
├── package-lock.json
└── README.md

```

## SDC310L 1.4 - Working with GitHub

**Student:** Jade Powell (JadPow5144)  
**Course:** SDC310L - Web Programming I Lab  
**Assignment:** 1.4 - Working with GitHub

From the Farm is an existing project being continued for this course. This update documents the repository as the starting point for planned PHP and MySQL shopping cart development. The current application remains a React interface; the planned database and cart features have not been implemented yet.

GitHub will be used to organize source files, track changes, and keep a history of development throughout the course. Earlier project contributors remain credited above.

### Assignment evidence

The assignment instructions call for the GitHub Hello World tutorial and screenshots showing repository creation, branch creation, a commit, a pull request, and a merged pull request. A Word document containing those screenshots and the requested repository link must be submitted separately. This README update and its release record do not by themselves demonstrate completion of those steps.

## SDC310L 2.3 - Create the Infrastructure

Retained the original React pages, styling, images, and navigation. Added Shopping Cart to the existing menu, a cart page framework, a PHP entry point and PDO connection file, and a SQL database export (`FromTheFarm.sql`). The current catalog still uses JavaScript data; database integration and working cart operations remain future development. See WEEK2-SETUP.md for local setup.

## SDC310L 3.3 - Adding Database Support

The existing Listings and Shopping Cart now support database-backed product loading, add/update/remove actions, session-specific cart persistence, totals, and simulated checkout through PHP/PDO/MySQL. The original design, images, navigation and contributor credits are retained. The database schema is unchanged, and `FromTheFarm.sql` remains the current structural export.

[Week 3 setup](WEEK3-SETUP.md) · [Validation results](VALIDATION-WEEK3.md)

The GitHub Pages site provides a labelled interactive browser preview. Run `php/index.php` through XAMPP for the actual database version. GitHub Pages cannot run PHP/MySQL.
