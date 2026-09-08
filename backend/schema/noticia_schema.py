from apiflask import Schema
from apiflask.fields import DateTime, String
from apiflask.validators import Length, URL
from marshmallow import pre_load


class NoticiaInSchema(Schema):
    titulo = String(required=True, validate=Length(min=1, max=255))
    link = String(required=True, validate=URL())
    autor = String(required=True, validate=Length(min=1, max=255))
    data = DateTime(required=True)
    texto = String(required=True, validate=Length(min=1))
    imagem = String(required=False, allow_none=True, validate=URL())

    @pre_load
    def limpar_campos_vazios(self, data, **kwargs):
        if data.get('imagem') == '':
            data['imagem'] = None
        return data
