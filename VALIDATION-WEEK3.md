# Week 3 validation

Validated November 25, 2026 against the repository's actual FromTheFarm.sql imported into a disposable MariaDB 11.8 database, using PHP 8.4 and PDO MySQL. No tests modified the student's database.

| Check | Result |
| --- | --- |
| PHP syntax | Passed |
| Read all five database products | Passed |
| Create cart and add items | Passed |
| Increase and update quantity | Passed |
| Remove item and set quantity to zero | Passed |
| Cart persists across requests in the same session | Passed |
| Different browser sessions have separate carts | Passed |
| Reject negative, fractional, string, excessive and above-stock quantities | Passed |
| Reject unknown product | Passed |
| Reject incorrect CSRF token | Passed |
| Two tomato units plus one honey jar | Subtotal $16.98; tax $0.85; shipping $1.70; total $19.53 |
| Checkout empties the cart | Passed |
| Original homepage and menu to catalog/cart navigation | Passed React test |
| Frontend Add to Cart and checkout navigation using API responses | Passed React test |
| Database failure does not silently switch to preview data | Passed React test |
| Production build and XAMPP packaging | Passed |

Frontend suite: 4 tests passed in 2 suites. The existing testing-library emits a React act deprecation warning; the tests pass. End-to-end browser rendering and the student's local XAMPP installation require separate verification. The Pages cart is explicitly a browser preview, not a live database.

Reproduce API integration tests only against a disposable imported database: run the PHP server with FTF_DB_* pointing to that database, then run python3 tests/api_integration.py with FTF_TEST_URL if needed. Tests create and clear temporary session carts.
