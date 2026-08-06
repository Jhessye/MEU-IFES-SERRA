from backend.model.base import BaseModel
from backend.extensions import db


class Oportunidade(BaseModel):
    __tablename__ = "oportunidades"

    titulo = db.Column(db.String(255), nullable=False)
    link = db.Column(db.String(500), nullable=False)
    cargaHoraria = db.Column(db.String(100), nullable=True)
    requisitos = db.Column(db.Text, nullable=True)
    observacoes = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            "id": str(self.id),
            "titulo": self.titulo,
            "cargaHoraria": self.cargaHoraria,
            "requisitos": self.requisitos,
            "observacoes": self.observacoes,
        }
