# Shared To-Do List Application

This is an end-to-end Shared To-Do List application built with:

- Frontend: Vite + TypeScript  
- Backend: Node.js + TypeScript + PostgreSQL  
- Authentication: Firebase Authentication  
- Deployment: Docker with docker-compose

---

## Project Overview

A collaborative to-do list application where users can create, share, and manage tasks in real-time.

---

## Features

- User authentication with Firebase  
- Task creation, editing, and sharing  
- Dockerized deployment for easy setup  

---

## Prerequisites

- Docker Desktop installed and running  
- Firebase service account credentials (`firebaseServiceAccountKey.json`)  

---

## Environment Variables

Create a `.env` file in `root/server` with the following variables:

```env
DATABASE_URL=postgresql://postgres:admin@host.docker.internal:5432/mern_app
JWT_SECRET=secret_key
PORT=5000
