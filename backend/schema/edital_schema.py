from apiflask import Schema
from apiflask.fields import String
from apiflask.validators import Length, URL
from marshmallow import pre_load


class EditalInSchema(Schema):
    titulo = String(required=True, validate=Length(min=1, max=200))
    link = String(required=True, validate=URL())
    pdf = String(required=False, allow_none=True, validate=URL())
    formulario = String(required=False, allow_none=True, validate=URL())
    texto = String(required=True, validate=Length(min=1))

    @pre_load
    def limpar_campos_vazios(self, data, **kwargs):
        for campo in ('pdf', 'formulario'):
            if data.get(campo) == '':
                data[campo] = None
        return data
