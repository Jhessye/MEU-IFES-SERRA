from backend.model.base import BaseModel
from backend.extensions import db
from datetime import date


class Oportunidade(BaseModel):
    __tablename__ = "oportunidades"

    titulo = db.Column(db.String(255), nullable=False)
    link_vaga = db.Column(db.String(500), nullable=False)
    cargaHoraria = db.Column(db.String(100), nullable=True)
    requisitos = db.Column(db.Text, nullable=True)
    observacoes = db.Column(db.Text, nullable=True)
    dataFinalInscricao = db.Column(db.Date, nullable=False)

    def dias_inscricao(self):
        return (self.dataFinalInscricao - date.today()).days

    def to_dict(self):
        return {
            "id": str(self.id),
            "titulo": self.titulo,
            "link_vaga": self.link_vaga,
            "cargaHoraria": self.cargaHoraria,
            "requisitos": self.requisitos,
            "observacoes": self.observacoes,
            "dataAtual": date.today().isoformat(),
            "dataFinalInscricao": self.dataFinalInscricao.isoformat(),
            "diasInscricao": self.dias_inscricao(),
        }
