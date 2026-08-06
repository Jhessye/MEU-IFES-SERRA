# backend/model/admin.py
from backend.model.base import BaseModel
from backend.extensions import db

class Admin(BaseModel):
    __tablename__ = "admins"

    username = db.Column(db.String(100), nullable=False, unique=True)
    senha_hash = db.Column(db.String(255), nullable=False)

    def to_dict(self):
        return {
            "id": str(self.id),
            "username": self.username,
            # nunca devolver senha_hash
        }