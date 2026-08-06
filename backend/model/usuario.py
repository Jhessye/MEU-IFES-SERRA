from backend.extensions import db
from backend.model.base import BaseModel

# Tabela intermediária para Usuários <-> Editais
usuario_editais = db.Table(
    'usuario_editais',
    db.Column('usuario_id', db.String, db.ForeignKey('usuarios.id'), primary_key=True),
    db.Column('edital_id', db.Integer, db.ForeignKey('editais.id'), primary_key=True)
)

# Tabela intermediária para Usuários <-> Oportunidades/Vagas
usuario_oportunidades = db.Table(
    'usuario_oportunidades',
    db.Column('usuario_id', db.String, db.ForeignKey('usuarios.id'), primary_key=True),
    db.Column('oportunidade_id', db.Integer, db.ForeignKey('oportunidades.id'), primary_key=True)
)

class Usuario(BaseModel):
    __tablename__ = "usuarios"

    recebeNotificacaoNoticia = db.Column(db.Boolean, default=False, nullable=False)
    recebeNotificacaoEdital = db.Column(db.Boolean, default=False, nullable=False)
    recebeNotificacaoOportunidade = db.Column(db.Boolean, default=False, nullable=False)

    # Relacionamentos N:N
    editais_salvos = db.relationship('Edital', secondary=usuario_editais, backref='usuarios_interessados')
    oportunidades_salvas = db.relationship('Oportunidade', secondary=usuario_oportunidades, backref='usuarios_interessados')

    def to_dict(self):
        return {
            "id": str(self.id),
            "recebeNotificacaoNoticia": self.recebeNotificacaoNoticia,
            "recebeNotificacaoEdital": self.recebeNotificacaoEdital,
            "recebeNotificacaoOportunidade": self.recebeNotificacaoOportunidade,
            #devolvendo apenas os IDs dos editais e oportunidades salvos pelo usuário
            "editais_salvos": [edital.id for edital in self.editais_salvos],
            "oportunidades_salvas": [op.id for op in self.oportunidades_salvas]
        }