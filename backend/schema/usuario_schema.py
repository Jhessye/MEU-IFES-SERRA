from apiflask import Schema
from apiflask.fields import UUID, Boolean

class UsuarioInSchema(Schema):
    id = UUID(required=False)
    recebeNotificacaoNoticia = Boolean(required=False, load_default=False)
    recebeNotificacaoEdital = Boolean(required=False, load_default=False)
    recebeNotificacaoOportunidade = Boolean(required=False, load_default=False)