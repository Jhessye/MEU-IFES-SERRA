from apiflask import Schema
from apiflask.fields import Boolean

class UsuarioInSchema(Schema):
    recebeNotificacaoNoticia = Boolean(required=False, load_default=False)
    recebeNotificacaoEdital = Boolean(required=False, load_default=False)
    recebeNotificacaoOportunidade = Boolean(required=False, load_default=False)