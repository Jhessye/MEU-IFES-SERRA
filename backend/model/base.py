from extensions import db
import uuid

class BaseModel(db.Model):
    __abstract__ = True
    
    id = db.Column(db.Uuid, primary_key=True, default=uuid.uuid4)
