<?php
// Serve the compiled ORIGINAL React application through XAMPP.
// Build assets are copied alongside this entry point.
$entry = __DIR__ . '/app.html';
if (!is_file($entry)) {
    http_response_code(503);
    exit('Application build missing. See WEEK2-SETUP.md.');
}
readfile($entry);
