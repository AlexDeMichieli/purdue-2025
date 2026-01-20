# Lesson 04 - Student Challenge: Online Bookstore Database

## Scenario
You've been hired to build a simple database for an online bookstore called **"PageTurner Books"**. The owner wants to track their book inventory and sales.

---

## Part 1: Create the Database and Tables

### Task 1.1: Create the Database
Create a new database called `bookstore_db` and switch to use it.

### Task 1.2: Create the Books Table
Create a table called `books` with the following columns:
| Column | Data Type | Constraints |
|--------|-----------|-------------|
| book_id | INT | PRIMARY KEY, AUTO_INCREMENT |
| title | VARCHAR(150) | |
| author | VARCHAR(100) | |
| price | DECIMAL(6,2) | |
| quantity_in_stock | INT | |
| category | VARCHAR(50) | |

### Task 1.3: Insert Sample Data
Insert the following books:

| title | author | price | quantity_in_stock | category |
|-------|--------|-------|-------------------|----------|
| The Great Gatsby | F. Scott Fitzgerald | 12.99 | 25 | Fiction |
| To Kill a Mockingbird | Harper Lee | 14.99 | 30 | Fiction |
| Python Crash Course | Eric Matthes | 39.99 | 15 | Technology |
| Clean Code | Robert Martin | 44.99 | 10 | Technology |
| Atomic Habits | James Clear | 16.99 | 40 | Self-Help |
| The Hobbit | J.R.R. Tolkien | 11.99 | 20 | Fiction |

---

## Part 2: Create Views

### Task 2.1: Create a View for Fiction Books
Create a view called `fiction_books` that shows only books in the "Fiction" category. Display the title, author, and price.

### Task 2.2: Create a View for Low Stock Books
Create a view called `low_stock_books` that shows books with `quantity_in_stock` less than 20. Display all columns.

---

## Part 3: Create Stored Procedures

### Task 3.1: Create a Basic Stored Procedure
Create a stored procedure called `GetAllBooks` that returns all books from the table.

### Task 3.2: Create a Procedure with IN Parameter
Create a stored procedure called `GetBooksByCategory` that accepts a category name as an IN parameter and returns all books in that category.

### Task 3.3: Create a Procedure with OUT Parameter
Create a stored procedure called `GetTotalInventoryValue` that calculates the total value of all inventory (price × quantity_in_stock for each book, summed together) and returns it via an OUT parameter.

**Hint:** Use `SUM(price * quantity_in_stock)`

---

## Part 4: Subqueries

### Task 4.1: Find Books Priced Above Average
Write a query using a subquery to find all books where the price is greater than the average price of all books.

### Task 4.2: Find the Most Expensive Book in Each Category
Write a query using a subquery to find books that have the highest price within their category.

**Hint:** You'll need to compare each book's price to the MAX price for its category.

---

## Bonus Challenge (Optional)

### Bonus 1: Create an INOUT Procedure
Create a stored procedure called `ApplyDiscount` that:
- Takes an INOUT parameter for a discount percentage (e.g., 10 for 10%)
- Updates all books in the "Technology" category by reducing their price by that percentage
- Returns the number of books updated via the same INOUT parameter

### Bonus 2: Complex View with Subquery
Create a view called `premium_books` that shows books priced above the average price, including a calculated column showing how much above average each book is.

---

## Expected Results Checklist

When you're done, verify your work:

- [ ] Database `bookstore_db` exists
- [ ] Table `books` contains 6 records
- [ ] `SELECT * FROM fiction_books;` returns 3 books
- [ ] `SELECT * FROM low_stock_books;` returns 2 books (Python Crash Course, Clean Code)
- [ ] `CALL GetAllBooks();` returns all 6 books
- [ ] `CALL GetBooksByCategory('Technology');` returns 2 books
- [ ] `CALL GetTotalInventoryValue(@total); SELECT @total;` returns the total inventory value
- [ ] Your above-average price query returns books over ~$23.65 (the average)

---

## Solution Reference

<details>
<summary>Click to reveal solutions (try on your own first!)</summary>

### Part 1 Solutions

```sql
-- Task 1.1
CREATE DATABASE bookstore_db;
USE bookstore_db;

-- Task 1.2
CREATE TABLE books (
    book_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(150),
    author VARCHAR(100),
    price DECIMAL(6,2),
    quantity_in_stock INT,
    category VARCHAR(50)
);

-- Task 1.3
INSERT INTO books (title, author, price, quantity_in_stock, category) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', 12.99, 25, 'Fiction'),
('To Kill a Mockingbird', 'Harper Lee', 14.99, 30, 'Fiction'),
('Python Crash Course', 'Eric Matthes', 39.99, 15, 'Technology'),
('Clean Code', 'Robert Martin', 44.99, 10, 'Technology'),
('Atomic Habits', 'James Clear', 16.99, 40, 'Self-Help'),
('The Hobbit', 'J.R.R. Tolkien', 11.99, 20, 'Fiction');
```

### Part 2 Solutions

```sql
-- Task 2.1
CREATE VIEW fiction_books AS
SELECT title, author, price
FROM books
WHERE category = 'Fiction';

-- Task 2.2
CREATE VIEW low_stock_books AS
SELECT * FROM books
WHERE quantity_in_stock < 20;
```

### Part 3 Solutions

```sql
-- Task 3.1
DELIMITER //
CREATE PROCEDURE GetAllBooks()
BEGIN
    SELECT * FROM books;
END //
DELIMITER ;

-- Task 3.2
DELIMITER //
CREATE PROCEDURE GetBooksByCategory(IN cat VARCHAR(50))
BEGIN
    SELECT * FROM books WHERE category = cat;
END //
DELIMITER ;

-- Task 3.3
DELIMITER //
CREATE PROCEDURE GetTotalInventoryValue(OUT totalValue DECIMAL(10,2))
BEGIN
    SELECT SUM(price * quantity_in_stock) INTO totalValue FROM books;
END //
DELIMITER ;
```

### Part 4 Solutions

```sql
-- Task 4.1
SELECT * FROM books
WHERE price > (SELECT AVG(price) FROM books);

-- Task 4.2
SELECT * FROM books b1
WHERE price = (
    SELECT MAX(price)
    FROM books b2
    WHERE b2.category = b1.category
);
```

### Bonus Solutions

```sql
-- Bonus 1
DELIMITER //
CREATE PROCEDURE ApplyDiscount(INOUT discountOrCount INT)
BEGIN
    DECLARE bookCount INT;

    UPDATE books
    SET price = price * (1 - discountOrCount / 100.0)
    WHERE category = 'Technology';

    SELECT ROW_COUNT() INTO bookCount;
    SET discountOrCount = bookCount;
END //
DELIMITER ;

-- Bonus 2
CREATE VIEW premium_books AS
SELECT
    title,
    author,
    price,
    category,
    ROUND(price - (SELECT AVG(price) FROM books), 2) AS above_average_by
FROM books
WHERE price > (SELECT AVG(price) FROM books);
```

</details>

---

Good luck!
