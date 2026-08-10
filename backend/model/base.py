from extensions import db
import uuid

#separando os ID
class BaseModel(db.Model):
    __abstract__ = True
    
    id = db.Column(db.Uuid, primary_key=True, default=uuid.uuid4)
