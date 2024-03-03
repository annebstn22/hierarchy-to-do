import json
from flask import Flask, request, jsonify, redirect, url_for
from flask_cors import CORS
from datetime import datetime, timedelta, timezone
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, \
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

# Add Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + db_name

# Suppresses warning while tracking modifications
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Secret Key
app.config["JWT_SECRET_KEY"] = 'asj93yr9fja9240q9whf0q29'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=5)
jwt = JWTManager(app)

# Initialising SQLAlchemy with Flask App
db.init_app(app)

 
# Create database
def create_db():
    with app.app_context():
        db.create_all()


# Redirect root path to /tasks
@app.route('/')
def index():
    return redirect(url_for('tasks'))


# Ensures the generated token remains valid by implementing a function
# that refreshes it close to its expiration
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


# On a login request, compare submitted email and password with
# hardcoded values. If correct, generate an access token for 
# the email address, and return it to the user.
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


# On a logout request, clear the access token from the user's cookies
@app.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response


# Fetch data related to logged in user
@app.route("/tasks", methods=["GET"])
@jwt_required()
def get_tasks():
    user_id = request.args.get('user_id')
    
    # Query the database to get the lists and tasks that belong to the provided user_id
    lists = List.query.filter_by(user_id=user_id, isDeleted=False).all()
    list_ids = [lst.list_id for lst in lists]
    tasks = Task.query.filter(Task.list_id.in_(list_ids), Task.isDeleted == False).all()
    
    # Convert SQLAlchemy objects to dictionaries for JSON serialization
    lists_data = [{'list_id': lst.list_id, 'list_name': lst.list_name, 'user_id': lst.user_id} for lst in lists]
    tasks_data = [{'task_id': task.task_id, 'task_title': task.task_title, 'done': task.done,
                   'list_id': task.list_id, 'parent_task_id': task.parent_task_id} for task in tasks]

    response = {
        'lists': lists_data,
        'tasks': tasks_data
    }

    return jsonify(response)


# Create a new task
@app.route('/tasks', methods=['POST'])
@jwt_required()
def create_task():
    task_data = request.json
    new_task = Task(**task_data)
    db.session.add(new_task)
    db.session.commit()
    return jsonify({"message": "Task created successfully", "task": new_task.to_dict()}), 201


# Create a new list
@app.route('/api/lists', methods=['POST'])
@jwt_required()
def create_list():
    list_data = request.get_json()
    new_list = List(**list_data)
    db.session.add(new_list)
    db.session.commit()
    return jsonify({"message": "Task created successfully", "list": new_list.to_dict()}), 201


# Update the list_id for all subtasks of the given task when
# moving a task to another list
def update_subtasks_list_id(task_id, new_list_id):
    subtasks = Task.query.filter_by(parent_task_id=task_id).all()
    for subtask in subtasks:
        subtask.list_id = new_list_id
        db.session.commit()
        update_subtasks_list_id(subtask.task_id, new_list_id)


# Update a task: edit name, mark as done, or move to another list
@app.route('/tasks/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    task_data = request.get_json()
    task = Task.query.get(task_id)

    if not task:
        return jsonify({'error': 'Task not found'}), 404

    # Update task attributes
    task.done = task_data.get('done', task.done)
    task.task_title = task_data.get('task_title', task.task_title)

    # If list_id is being updated, update it for all subtasks as well
    if 'list_id' in task_data:
        new_list_id = task_data['list_id']
        task.list_id = new_list_id
        db.session.commit()  # commit changes after updating the task's list_id

        # Update list_id for all subtasks
        update_subtasks_list_id(task_id, new_list_id)

    return jsonify({"message": "Task updated successfully", "task": task.to_dict()}), 200


# Update list name
@app.route('/lists/<int:list_id>', methods=['PUT'])
@jwt_required()
def update_list(list_id):
    list_data = request.json
    list_to_update = List.query.get(list_id)

    if not list_to_update:
        return jsonify({'error': 'List not found'}), 404

    # Update list name
    list_to_update.list_name = list_data.get('list_name', list_to_update.list_name)

    db.session.commit()
    return jsonify({"message": "List updated successfully", "list": list_to_update.to_dict()}), 200


# Delete a task
@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get(task_id)

    if not task:
        return jsonify({'error': 'Task not found'}), 404

    # Soft delete: Set isDeleted to True instead of actually deleting the task
    task.isDeleted = True
    db.session.commit()

    return jsonify({'message': 'Task deleted successfully'}), 200


# Delete a list
@app.route('/lists/<int:list_id>', methods=['DELETE'])
@jwt_required()
def delete_list(list_id):
    list_to_delete = List.query.get(list_id)

    if not list_to_delete:
        return jsonify({'error': 'List not found'}), 404

    # Soft delete: Set isDeleted to True instead of actually deleting the list
    list_to_delete.isDeleted = True

    # Soft delete for associated tasks as well
    tasks_to_delete = Task.query.filter_by(list_id=list_id).all()
    for task in tasks_to_delete:
        task.isDeleted = True

    db.session.commit()

    return jsonify({'message': 'List and associated tasks deleted successfully'}), 200


if __name__ == "__main__":
    create_db()
    app.run(debug=True)