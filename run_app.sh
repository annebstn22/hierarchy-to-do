#!/bin/bash

# Backend setup
python3 -m venv venv
source venv/bin/activate
pip3 install -r requirements.txt

# Initialize the database
python3 init_db.py

# Run the Flask app
python3 app.py &

# Frontend setup
cd client
npm install

# Run the React app
npm start
