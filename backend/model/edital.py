from backend.model.base import BaseModel
from backend.extensions import db


class Edital(BaseModel):
    __tablename__ = "editais"

    titulo = db.Column(db.String(255), nullable=True)
    link = db.Column(db.String(500), nullable=True)
    pdf = db.Column(db.String(500), nullable=True)
    formulario = db.Column(db.String(500), nullable=True)
    texto = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            "id": str(self.id),
            "titulo": self.titulo,
            "link": self.link,
            "pdf": self.pdf,
            "formulario": self.formulario,
            "texto": self.texto,
        }

