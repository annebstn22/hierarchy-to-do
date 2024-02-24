#
import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta, timezone
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager
from flask_jwt_extended import JWTManager


# Create app instance
app = Flask(__name__)
CORS(app)

# Setup the Flask-JWT-Extended extension
#app.config["JWT_SECRET_KEY"] = os.environ.get('JWT_SECRET')  # Change this!
app.config["JWT_SECRET_KEY"] = 'asj93yr9fja9240q9whf0q29'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
jwt = JWTManager(app)


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
    if email != "test" or password != "test":
        return {"msg": "Wrong email or password"}, 401

    access_token = create_access_token(identity=email)
    response = {"access_token": access_token}
    return response


@app.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response


# Members API Route
@app.route("/tasks")
@jwt_required()
def tasks():
    
    response = {
        "users": [
            {"user_id": 1,
             "email": "user@example.com",
             "password": "hashedpassword"
             }
        ],
        "lists": [
            {"list_id": 1,
             "list_name": "CS162",
             "user_id": 1
             },
            {"list_id": 2,
             "list_name": "CS113",
             "user_id": 1
            }
        ],
        "tasks": [
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
             "parent_task_id": 5}
        ]
        }
    response_body = {
        "tasks": [
            "Finish authentication", 
            "Add task page", 
            "Add hierarchy"]   
    }
    return response


@app.route("/profile")
@jwt_required()
def my_profile():
    response_body = {
        "name": "Nagato",
        "about": "Hello! I'm a full stack developer that loves python and javascript"
    }

    return response_body


#if __name__ == "__main__":
    #app.run(debug=True)