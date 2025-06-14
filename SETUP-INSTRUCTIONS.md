# Shared To-Do List

## Features

- User authentication with Firebase
- Create, edit, delete to-do items
- Share tasks with other users
- Persistent data with PostgreSQL
- Dockerized for easy development and deployment

---

## Prerequisites

Make sure you have installed the following tools before starting the application:

- [Node.js](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [pgAdmin](https://www.pgadmin.org/)
- Firebase service account credentials (JSON)


---


## Firebase Credentials

Place the `firebaseServiceAccountKey.json` file (your Firebase service account credentials) inside the `server` directory at the project root (i.e., `shared-to-do-list/server`).

---

## Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
DATABASE_URL=postgresql://postgres:admin@host.docker.internal:5432/mern_app
JWT_SECRET=secret_key
PORT=5000
```
---

## Database Setup with pgAdmin

1. **Open pgAdmin** and connect to your local PostgreSQL server.
2. **Create a new database** named: `mern_app`
3. **Navigate to**:  
   `Servers > PostgreSQL > Databases > mern_app > Schemas > public > Tables`
4. **Open the Query Tool** and execute the following SQL statements one at a time:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
    shared_with TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
---

## Running the Servers Locally

To run the project servers on your local machine, follow these steps:

1. **Firebase Credentials**  
   Place the firebaseServiceAccountKey.json file (your Firebase service account credentials) inside the server directory at the project root (i.e., shared-to-do-list/server).

2. **Environment Variables**  
   Create a .env file containing your environment variables inside the server directory at the project root (i.e., shared-to-do-list/server).

3. **Start Docker Desktop**  
   Make sure Docker Desktop is running on your machine before starting the application.

4. **Start the Application**  
   From the root directory of the project, run the following command to build and start the containers:
```bash
docker-compose up --build
```

5. **View the Application**  
   Once the containers are up, open your browser and navigate to:  
   [http://localhost:5173](http://localhost:5173)
   
---

## Project Structure

```
shared-to-do-list/
├── client/
├── server/
│   ├── .env                        # Environment variables for backend
│   └── firebaseServiceAccountKey.json  # Firebase service account credentials
├── docker-compose.yml              # Docker compose configuration
├── README.md                      # Project documentation
└── Running-the-Servers-Locally-README.md  # Instructions for running servers locally
```
