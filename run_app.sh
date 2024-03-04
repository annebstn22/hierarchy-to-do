#!/bin/bash

# Backend setup
cd flask-server
python3 -m venv venv
source venv/bin/activate

# Install backend dependencies from the backend requirements.txt file
pip3 install -r requirements.txt

# Run the Flask app in the background
nohup python3 app.py &

# Initialize the database
python3 init_db.py

cd ..

# Install general dependencies from the root requirements.txt file
pip3 install -r requirements.txt

# Frontend setup
cd client
npm install axios

# Run the React app
npm start
