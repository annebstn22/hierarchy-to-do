# Project Overview
Welcome to the To-Do App! This project is a hierarchical to-do list application designed to help you manage your tasks efficiently. The app allows you to organize your tasks in a structured manner, making it easy to prioritize and track your progress.

# Features
* Hierarchical Structure: Create a hierarchy of tasks to better organize your to-do list.
* User-Friendly Interface: The app provides a clean and intuitive user interface for an optimal user experience.
* Backend Flask Server: The backend, built with Flask, handles data storage, retrieval, and business logic.

# Frontend
The frontend code is located in the *client* folder. Inside the *client/src* directory, you'll find the *components* folder, which contains all the React components used in the app. Each component is organized for clarity and modularity.

# Backend
The backend code is situated in the flask-server folder. Key files include:

* app.py: This file contains the Flask application, where routes and API endpoints are defined.

* models.py: This file contains the database models. These files define the structure of the data stored in the application.

* init_db.py: Use this file to set up and initialize the database with the necessary tables and initial data. 

Run `python init_db.py` to reinitialize the database within the *flask-server* file

# Loom App Explanation

[Loom link]()

# Running the App

To run the app, you can

### `python3 -m venv venv`
### `source venv/bin/activate`
### `pip3 install -r requirements.txt`
### `cd flask-server`
### `flask run`

In a new terminal, launch the frontend

### `cd client`
### `npm start`

Open [http://localhost:3000](http://localhost:3000) to view it in your browser


# AI Statement: 

I used ChatGPT and Git Copilot to generate code, to help debug error codes, to figure out why my code isn't working as I'd like it to, and to help generate the CSS for my app design. I prioritized incorporating what I learned from documentation and tutorials I found online. Once I understood and incorporated it, I used ChatGPT to replicate the code for other features (e.g., PUT requests)

# HC and LOs:

**#breakitdown**: Organized the app into modular components, beginning with a basic list structure. and subsequently integrating hierarchical features followed by the systematic addition of checkboxes, editing, deletion, and task moving. Implemented a gradual transition from hardcoded JSON data to a database, such that only one new element was integrated at a time for easy bug identification.

**#cs110_CodeReadability**: Structured React components to enhance HTML code readability, incorporating meaningful comments to outline each component's purpose. Maintained consistent whitespace conventions for improved code readability. Integrated error and 'success' messages within the code to assist in debugging, enabling quick identification of issues related to HTTP requests and data integrity.

**#cs162_separationofconcerns**: Created dedicated React components, like TaskForm for new task addition and useToken for token management. Ensured a clear division between frontend (React) and backend (Flask), while organizing backend functionality into separate files for database models (structure) and data initialization.

**#cs162_webstandards**: Adhered to web standards by adopting modern React practices, utilizing hooks instead of classes for component development. Implemented HTTP requests through axios, a standard promise-based HTTP library. Integrated Flask-SQLAlchemy with SQLAlchemy for database functionality. Established secure authentication using Flask-JWT, incorporating @jwt_required() decorators in the backend to mandate token access for specific pages. Ensured streamlined HTML structure by assigning classNames and minimizing the necessity for redundant CSS through nested components.


# References:

### Login authentication
Abdulsalam, F. (2022, January 20). How to connect Flask to ReactJs. DEV Community. https://dev.to/nagatodev/how-to-connect-flask-to-reactjs-1k8i

Abdulsalam, F. (2022b, January 28). How to add login authentication to a Flask and React application. DEV Community. https://dev.to/nagatodev/how-to-add-login-authentication-to-a-flask-and-react-application-23i7

### Create React Flask Project Setup
Arpan Neupane. (2021, June 26). How to create a Flask + React Project | Python Backend + React Frontend [Video]. YouTube. https://www.youtube.com/watch?v=7LNl2JlZKHA

### Create useLocalStorage custom hook
Dev, C. (2023, December 20). Understanding React State Management: Exploring UseState and UseLocalStorage Hooks | Medium. Medium. https://medium.com/@chesko.dev/usestate-vs-uselocalstorage-a1dc756ddd95#:~:text=While%20useState%20is%20effective%20for,site%2C%20the%20state%20will%20persist.

### Create an SQLite Database with SQLAlchemy
Pal, S. (2023, August 6). How to Create and Connect an SQLite Database with Flask App using Python. GeekPython - Python Programming Tutorials. https://geekpython.in/connect-sqlite-database-with-flask-app

### App Design Inspiration:
Coding With Dawid. (2022, November 5). Build a Todo App with React.js | Beginner React Project using hooks [Video]. YouTube. https://www.youtube.com/watch?v=QdTHUv79EZc
