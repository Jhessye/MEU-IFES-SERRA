from backend.model.oportunidade import Oportunidade
from backend.extensions import db

def listar_oportunidades():
    oportunidades = db.session.get(Oportunidade, Oportunidade.id).all()
    return [oportunidade.to_dict() for oportunidade in oportunidades]

def criar_oportunidade(data):
    try:
        titulo = data.get("titulo")
        carga_horaria = data.get("cargaHoraria")
        requisitos = data.get("requisitos")
        observacoes = data.get("observacoes")

        if not titulo or not carga_horaria or not requisitos:
            return None #dados incompletos

        nova_oportunidade = Oportunidade(
            titulo=titulo,
            cargaHoraria=carga_horaria,
            requisitos=requisitos,
            observacoes=observacoes
        )
        db.session.add(nova_oportunidade)
        db.session.commit()
        return nova_oportunidade.to_dict()
    except (AttributeError, TypeError, KeyError, ValueError):
        return None

def atualizar_oportunidade(oportunidade_id, data):
    oportunidade = db.session.get(Oportunidade, oportunidade_id)
    if not oportunidade:
        return None #oportunidade nao existe

    try:
        titulo = data.get("titulo")
        carga_horaria = data.get("cargaHoraria")
        requisitos = data.get("requisitos")
        observacoes = data.get("observacoes")

        if not titulo or not carga_horaria or not requisitos:
            return None #dados incompletos

        oportunidade.titulo = titulo
        oportunidade.cargaHoraria = carga_horaria
        oportunidade.requisitos = requisitos
        oportunidade.observacoes = observacoes

        db.session.commit()
        return oportunidade.to_dict()
    except (AttributeError, TypeError, KeyError, ValueError):
        return None

def deletar_oportunidade(oportunidade_id):
    oportunidade = db.session.get(Oportunidade, oportunidade_id)
    if not oportunidade:
        return None #oportunidade nao existe
    db.session.delete(oportunidade)
    db.session.commit()
    return True