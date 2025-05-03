# Click Fit

A responsive fitness website with image upload functionality.

## Project Structure

```
click-fit/
├── public/
│   └── index.html           # The main HTML file
|   └── js
|        └──main.js           # The main Javascript file
|   └──styles
|      └──main.css           # The main css file
├── upload_images/           # Directory where uploaded images are stored
├── server.js                # Node.js server file
├── package.json             # Project dependencies
├── package-lock.json
└── README.md                # Project documentation
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Jeccoman/click-fit.git
cd click-fit
```

2. Install dependencies:
```bash
npm install
```

3. Set up MySQL database:
   - Create a MySQL database named `clickfit_db`
   - Configure the database connection in `server.js`
   - Run the SQL script in `mysql-script.sql` to create tables and stored procedures

4. Start the application:
```bash
npm start
```

5. Access the website at http://localhost:3000

## Features

- Responsive design using Bootstrap
- Interactive UI with jQuery animations
- Image upload functionality via drag & drop or file selection
- Node.js backend with Express
- MySQL database integration with stored procedures
- Daily fact display using AJAX

## Technologies Used

- HTML5, CSS3, JavaScript
- Bootstrap 5
- jQuery
- Node.js with Express
- MySQL
- Multer for file uploads

## API Integrations

- Numbers API (http://numbersapi.com) for daily facts

## Requirements Fulfilled

1. Responsive UI using Bootstrap and custom CSS
2. AJAX call to Numbers API to fetch and display daily facts
3. Drag and drop image upload functionality
4. Node.js backend for handling image uploads
5. MySQL database with users table and stored procedure