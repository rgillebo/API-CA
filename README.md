# TODO List Api 

This TODO list api is the back end for a potential web application. 

## TECHNOLOGIES USED

- **Node.js:** JavaScript runtime used for server-side development. This app uses version "v20.10.0". 
- **JWT (JSON Web Tokens):** Used to handle authentication and keep sessions secure. Ensuring API requests are verified and allowed only if token is valid. 
- **bcrypt.js:** Used for hashing user passwords before storing them. 
- **Swagger:** Used for creating dynamic API documentation that can be interacted with in the browser. 
- **JSend:** Used for formatting responses and maintain consistency. 
- **Express:** Web framework for building the server and handling routes.
- **MySQL2:** MySQL client for Node.js. 
- **Sequelize:** ORM used for database interactions.
- **dotenv:** For managing environment variables. 
- **Morgan:** Middleware for logging HTTP requests for Node.js. 
- **Other dependencies** listed in the [package.json] file.

## INSTALLATION

### Prerequisites

- Node.js: [Download and install Node.js](https://nodejs.org/)
- MySQL: [Download and install MySQL](https://www.mysql.com/downloads/)

### Steps

1. **Clone the repository:**

- Navigate to the repository [https://github.com/rgillebo/API-CA](https://github.com/rgillebo/API-CA)
- Clone the repository:

    ```bash
    git clone https://github.com/rgillebo/API-CA
    cd API-CA
    ```

2. **Install Dependencies**

- Open a terminal or command prompt.
- Navigate to the project directory: 

    ```bash 
    cd path/to/API-CA 
    ```

- Run the following command to install dependencies: 

    ```bash
    npm install
    ```
- Create environment variables by creating a ".env" file in the root of the project and add the following data: 

    ```bash
    HOST=localhost
    ADMIN_USERNAME=admin
    ADMIN_PASSWORD=P@ssw0rd
    DATABASE_NAME=myTodo
    DIALECT=mysql
    PORT=3000
    TOKEN_SECRET=958a8c384b4fb5df44518a6f1ef051bcf83c23e25e9edd6abce1b8e29008199cadd0098491e340f554bde65426c210dd9077886f300ef08d1fa505bd7fbfb21b
    ```

 - Create a database for the project - please refer to [DATABASE](#database). 

 - Set up access to the database - please refer to [DATABASEACCESS](#databaseaccess)


---

## USAGE

### Starting the application

1. If already navigated to project directory, skip to step 2. If not, in a terminal or command prompt run: 

    ```bash 
    cd path/to/aug23ft-api-ca-1-rgillebo   
    ```

2. In a terminal or command prompt, run the following command to start the server: 

    ```bash
    npm start
    ```

3. **Follow instructions below:**

- **API Documentation:** Once the server is running, visit [http://localhost:3000/doc](http://localhost:3000/doc) for viewing API documentation. Testing can also be done here, as well as in Postman. 

---
## DATABASE

**To create the database for the web application run the following SQL script:** 

    
    CREATE DATABASE IF NOT EXISTS myTodo; 

---

## DATABASEACCESS

**To setup the database access, the following SQL script can be used:** 

    CREATE USER 'admin'@'localhost' IDENTIFIED BY 'P@ssw0rd';
    GRANT ALL PRIVILEGES ON myTodo.* TO 'admin'@'localhost';
    FLUSH PRIVILEGES;
---

## ADDITIONAL INFORMATION

- `/routes`: Server-side code for routes & authentication.
- `/models`: Used for database table association.
- `/initialization`: Initial status table data population. 
- `/migrations`: Initial table creation.
- `/__tests__`: Testing script. 
---

## CONTRIBUTORS

- [Ruben Gillebo Kjær]

---