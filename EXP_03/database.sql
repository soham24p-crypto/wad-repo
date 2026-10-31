-- Optional: the app creates these automatically. Use this only if you want to make them by hand in phpMyAdmin.
CREATE DATABASE IF NOT EXISTS registration_db;
USE registration_db;
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  password VARCHAR(255)
);
