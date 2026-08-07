from apiflask import Schema
from apiflask.fields import DateTime, String
from apiflask.validators import Length, URL


class NoticiaInSchema(Schema):
    titulo = String(required=True, validate=Length(min=1, max=255))
    link = String(required=False, allow_none=True, validate=URL())
    autor = String(required=True, validate=Length(min=1, max=255))
    data = DateTime(required=True)
    texto = String(required=True, validate=Length(min=1))
    imagem = String(required=False, allow_none=True, validate=URL())
