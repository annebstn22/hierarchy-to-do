from database import db

class User(db.Model):
    __tablename__ = 'user'
    
    user_id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    lists = db.relationship('List', backref='user', lazy=True)
    
    
class List(db.Model):
    __tablename__ = 'list'
    
    list_id = db.Column(db.Integer, primary_key=True)
    list_name = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)
    tasks = db.relationship('Task', backref='list', lazy=True)
    isDeleted = db.Column(db.Boolean, default=False, nullable=False)  
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'list_name': self.list_name
        }
    
    
class Task(db.Model):
    __tablename__ = 'task'
    
    task_id = db.Column(db.Integer, primary_key=True)
    task_title = db.Column(db.String(100), nullable=False)
    done = db.Column(db.Boolean, nullable=False)
    list_id = db.Column(db.Integer, db.ForeignKey('list.list_id'), nullable=False)
    parent_task_id = db.Column(db.Integer, db.ForeignKey('task.task_id'), nullable=True)
    subtasks = db.relationship('Task', backref=db.backref('parent_task', remote_side=[task_id]), lazy=True)
    isDeleted = db.Column(db.Boolean, default=False, nullable=False)  

    
    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}