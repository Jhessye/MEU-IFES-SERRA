from backend.model.base import BaseModel
from backend.extensions import db


class Noticia(BaseModel):
    __tablename__ = "noticias"

    titulo = db.Column(db.String(255), nullable=False)
    autor = db.Column(db.String(255), nullable=False)
    data = db.Column(db.DateTime, nullable=False)
    texto = db.Column(db.Text, nullable=False)
    imagem = db.Column(db.String(500), nullable=True)

    def to_dict(self):  
        return {
            "id": str(self.id),
            "titulo": self.titulo,
            "autor": self.autor,
            "data": self.data.isoformat() if self.data else None,
            "texto": self.texto,
            "imagem": self.imagem,
        }
