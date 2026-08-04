from backend.model.oportunidade import Oportunidade
from extensions import db

def listar_oportunidades():
    oportunidades = Oportunidade.query.all()
    return [oportunidade.to_dict() for oportunidade in oportunidades]

def criar_oportunidade(data):
    nova_oportunidade = Oportunidade(
        titulo=data["titulo"],
        cargaHoraria=data["cargaHoraria"],
        requisitos=data["requisitos"],
        observacoes=data["observacoes"]
    )
    if not nova_oportunidade.titulo or not nova_oportunidade.cargaHoraria or not nova_oportunidade.requisitos:
        return None #dados incompletos
    db.session.add(nova_oportunidade)
    db.session.commit()
    return nova_oportunidade.to_dict()

def atualizar_oportunidade(oportunidade_id, data):
    oportunidade = Oportunidade.query.get(oportunidade_id)
    if not oportunidade:
        return None #oportunidade nao existe

    if not data.get('titulo') or not data.get('cargaHoraria') or not data.get('requisitos'):
        return None #dados incompletos

    oportunidade.titulo = data['titulo']
    oportunidade.cargaHoraria = data['cargaHoraria']
    oportunidade.requisitos = data['requisitos']
    oportunidade.observacoes = data['observacoes']

    db.session.commit()
    return oportunidade.to_dict()

def deletar_oportunidade(oportunidade_id):
    oportunidade = Oportunidade.query.get(oportunidade_id)
    if not oportunidade:
        return None #oportunidade nao existe
    db.session.delete(oportunidade)
    db.session.commit()
    return True