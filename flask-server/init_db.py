from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from models import User, List, Task  # Import your SQLAlchemy models from models.py
from app import app  # Import the Flask app and SQLAlchemy instance from app.py
from database import db  # Import the SQLAlchemy instance from database.py


def init_db():
    # Create the database tables
    with app.app_context():
        db.drop_all()  # Clear the tables
        db.create_all()

        # Add initial data to the database
        users_data = [
            {"user_id": 1, "email": "user@example.com", "password": "123"},
            {"user_id": 2, "email": "user2@example.com", "password": "456"},
        ]

        lists_data = [
            {"list_id": 1, "list_name": "CS162", "user_id": 1},
            {"list_id": 2, "list_name": "CS113", "user_id": 1},
            {"list_id": 3, "list_name": "Math101", "user_id": 2}
        ]

        tasks_data = [
            {"task_id": 1, "task_title": "To do list app", "done": False, "list_id": 1, "parent_task_id": None},
            {"task_id": 2, "task_title": "Assignment 1", "done": False, "list_id": 1, "parent_task_id": 1},
            {"task_id": 3, "task_title": "Read Chapter 1", "done": False, "list_id": 1, "parent_task_id": 2},
            {"task_id": 4, "task_title": "Assignment 2", "done": True, "list_id": 1, "parent_task_id": 1},
            {"task_id": 5, "task_title": "CS113 Lecture", "done": False, "list_id": 2, "parent_task_id": None},
            {"task_id": 6, "task_title": "Lab Exercise", "done": False, "list_id": 2, "parent_task_id": 5},
            {"task_id": 7, "task_title": "Homework", "done": False, "list_id": 2, "parent_task_id": 5},
            {"task_id": 8, "task_title": "Math101 Assignment", "done": True, "list_id": 3, "parent_task_id": None},
            {"task_id": 9, "task_title": "Study for Math101 Exam", "done": False, "list_id": 3, "parent_task_id": 8}
        ]

        for user_data in users_data:
            user = User(**user_data)
            db.session.add(user)

        for list_data in lists_data:
            lst = List(**list_data)
            db.session.add(lst)

        for task_data in tasks_data:
            task = Task(**task_data)
            db.session.add(task)

        db.session.commit()


if __name__ == '__main__':
    init_db()
