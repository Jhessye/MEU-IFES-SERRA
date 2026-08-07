from apiflask import Schema
from apiflask.fields import String
from apiflask.validators import Length, URL


class OportunidadeInSchema(Schema):
    titulo = String(required=True, validate=Length(min=1, max=255))
    link_vaga = String(required=True, validate=URL())
    cargaHoraria = String(required=True, validate=Length(min=1, max=100))
    requisitos = String(required=True, validate=Length(min=1))
    observacoes = String(required=False, allow_none=True)
