from extensions import db
from base import BaseModel

class Usuario(BaseModel):
    __tablename__ = "usuarios"

    recebeNotificacaoNoticia = db.Column(db.Boolean, default=False, nullable=False)
    recebeNotificacaoEdital = db.Column(db.Boolean, default=False, nullable=False)
    recebeNotificacaoOportunidade = db.Column(db.Boolean, default=False, nullable=False)

    def to_dict(self):
        return {
            "id": str(self.id),
            "recebeNotificacaoNoticia": self.recebeNotificacaoNoticia,
            "recebeNotificacaoEdital": self.recebeNotificacaoEdital,
            "recebeNotificacaoOportunidade": self.recebeNotificacaoOportunidade,
        }