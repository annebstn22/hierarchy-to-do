#
import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta, timezone
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
from database import db
from models import User, Task, List

# Create app instance
app = Flask(__name__)
CORS(app)

# Database name
db_name = 'todo.db'

# Setup the Flask-JWT-Extended extension
# app.config["JWT_SECRET_KEY"] = os.environ.get('JWT_SECRET')  # Change this!

# Add Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + db_name

# Suppresses warning while tracking modifications
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Secret Key
app.config["JWT_SECRET_KEY"] = 'asj93yr9fja9240q9whf0q29'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
jwt = JWTManager(app)

# Initialising SQLAlchemy with Flask App
db.init_app(app)


def create_db():
    with app.app_context():
        db.create_all()


# Hardcoded users
users = [
    {"user_id": 1, "email": "user@example.com", "password": "123"},
    {"user_id": 2, "email": "user2@example.com", "password": "456"}
]

lists = [
    {"list_id": 1, "list_name": "CS162", "user_id": 1},
    {"list_id": 2, "list_name": "CS113", "user_id": 1},
    {"list_id": 3, "list_name": "Math101", "user_id": 2}
]

tasks = [
        {"task_id": 1,
         "task_title": "To do list app",
         "done": False,
         "list_id": 1,
         "parent_task_id": None},
        {"task_id": 2,
         "task_title": "Assignment 1",
         "done": False,
         "list_id": 1,
         "parent_task_id": 1},
        {"task_id": 3,
         "task_title": "Read Chapter 1",
         "done": False,
         "list_id": 1,
         "parent_task_id": 2},
        {"task_id": 4,
         "task_title": "Assignment 2",
         "done": True,
         "list_id": 1,
         "parent_task_id": 1},
        {"task_id": 5,
         "task_title": "CS113 Lecture",
         "done": False,
         "list_id": 2,
         "parent_task_id": None},
        {"task_id": 6,
         "task_title": "Lab Exercise",
         "done": False,
         "list_id": 2,
         "parent_task_id": 5},
        {"task_id": 7,
         "task_title": "Homework",
         "done": False,
         "list_id": 2,
         "parent_task_id": 5},
        {"task_id": 8,
         "task_title": "Math101 Assignment",
         "done": True,
         "list_id": 3,
         "parent_task_id": None},
        {"task_id": 9,
         "task_title": "Study for Math101 Exam",
         "done": False,
         "list_id": 3,
         "parent_task_id": 8}]



# The generated token always has a lifespan after which it expires
# . To ensure that this does not happen while the user is logged in
# , you have to create a function that refreshes the token when it 
# is close to the end of its lifespan. First, specify the lifespan 
# for your generated tokens and add it as a new configuration for 
# your application.
@app.after_request
@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token 
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        return response


# CHANGE TO COMPARE WITH DATA IN DATABASE
# Whenever the user submits a login request, the email and password 
# are extracted and compared with the hardcoded email(test) and 
# password(test)

# If the login details are not correct, the error message Wrong email 
# or password with the status code 401 which means UNAUTHORIZED Error
# is sent back to the user.

# Else if the login details are confirmed to be correct, an access token
# is created for that particular email address by assigning the email to 
# the identity variable

# token is returned to the user.
@app.route("/token", methods=["POST"])
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    # Query the User model from the database
    user = User.query.filter_by(email=email, password=password).first()

    if user:
        access_token = create_access_token(identity=email)
        # Include the user_id in the response
        return jsonify(access_token=access_token, user_id=user.user_id), 200

    return {"msg": "Wrong email or password"}, 401


@app.route('/get_data', methods=['GET'])
def get_data():
    user_id = request.args.get('user_id')

    # Query the database to get the lists and tasks that belong to the provided user_id
    lists = List.query.filter_by(user_id=user_id).all()
    tasks = Task.query.filter(Task.list_id.in_([lst.list_id for lst in lists])).all()

    # Convert SQLAlchemy objects to dictionaries for JSON serialization
    lists_data = [{'list_id': lst.list_id, 'list_name': lst.list_name, 'user_id': lst.user_id} for lst in lists]
    tasks_data = [{'task_id': task.task_id, 'task_title': task.task_title, 'done': task.done,
                   'list_id': task.list_id, 'parent_task_id': task.parent_task_id} for task in tasks]

    response = {
        'lists': lists_data,
        'tasks': tasks_data
    }

    return jsonify(response)



@app.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response


@app.route("/tasks", methods=["GET"])
@jwt_required()
def get_tasks():
    user_id = request.args.get('user_id')
    
    # Filter tasks and lists based on user_id
    user_tasks = [task for task in tasks if task['list_id'] in [lst['list_id'] for lst in lists if lst['user_id'] == int(user_id)]]
    user_lists = [lst for lst in lists if lst['user_id'] == int(user_id)]

    return jsonify({'tasks': user_tasks, 'lists': user_lists})


@app.route("/profile")
@jwt_required()
def my_profile():
    response_body = {
        "name": "Nagato",
        "about": "Hello! I'm a full stack developer that loves python and javascript"
    }

    return response_body


if __name__ == "__main__":
    from models import User, Task, List
    create_db()
    app.run(debug=True)