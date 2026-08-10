from backend.extensions import db
from backend.model.base import BaseModel

usuario_editais = db.Table(
    'usuario_editais',
    db.Column('usuario_id', db.Uuid, db.ForeignKey('usuarios.id'), primary_key=True),
    db.Column('edital_id', db.Uuid, db.ForeignKey('editais.id'), primary_key=True)
)

usuario_oportunidades = db.Table(
    'usuario_oportunidades',
    db.Column('usuario_id', db.Uuid, db.ForeignKey('usuarios.id'), primary_key=True),
    db.Column('oportunidade_id', db.Uuid, db.ForeignKey('oportunidades.id'), primary_key=True)
)

class Usuario(BaseModel):
    __tablename__ = "usuarios"

    recebeNotificacaoNoticia = db.Column(db.Boolean, default=False, nullable=False)
    recebeNotificacaoEdital = db.Column(db.Boolean, default=False, nullable=False)
    recebeNotificacaoOportunidade = db.Column(db.Boolean, default=False, nullable=False)
    #token para envio de notificações push via Expo
    expo_push_token = db.Column(db.String(255), nullable=True)

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