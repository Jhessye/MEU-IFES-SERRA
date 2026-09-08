from apiflask import Schema
from apiflask.fields import Date, String
from apiflask.validators import Length, URL
from marshmallow import pre_load


class OportunidadeInSchema(Schema):
    titulo = String(required=True, validate=Length(min=1, max=255))
    link_vaga = String(required=True, validate=URL())
    cargaHoraria = String(required=True, validate=Length(min=1, max=100))
    requisitos = String(required=True, validate=Length(min=1))
    observacoes = String(required=False, allow_none=True)
    dataFinalInscricao = Date(required=True)

    @pre_load
    def limpar_campos_vazios(self, data, **kwargs):
        for campo in ('cargaHoraria', 'requisitos', 'observacoes'):
            if data.get(campo) == '':
                data[campo] = None
        return data
