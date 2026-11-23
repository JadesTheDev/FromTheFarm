<?php
// Local XAMPP defaults. Set environment variables for other installations.
$host = getenv('FTF_DB_HOST') ?: '127.0.0.1';
$name = getenv('FTF_DB_NAME') ?: 'FromTheFarm';
$user = getenv('FTF_DB_USER') ?: 'root';
$pass = getenv('FTF_DB_PASSWORD') ?: '';
$pdo = new PDO("mysql:host=$host;dbname=$name;charset=utf8mb4", $user, $pass, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
]);
