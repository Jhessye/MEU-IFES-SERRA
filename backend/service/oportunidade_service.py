from backend.model.oportunidade import Oportunidade
from backend.extensions import db
from backend.model.usuario import Usuario
from backend.service import notificacao_service

def listar_oportunidades():
    oportunidades = Oportunidade.query.all()
    return [oportunidade.to_dict() for oportunidade in oportunidades]

def criar_oportunidade(data):
    try:
        titulo = data.get("titulo")
        link_vaga = data.get("link_vaga")
        carga_horaria = data.get("cargaHoraria")
        requisitos = data.get("requisitos")
        observacoes = data.get("observacoes")

        if not titulo or not carga_horaria or not requisitos:
            return None #dados incompletos

        nova_oportunidade = Oportunidade(
            titulo=titulo,
            link_vaga=link_vaga,
            cargaHoraria=carga_horaria,
            requisitos=requisitos,
            observacoes=observacoes
        )
        db.session.add(nova_oportunidade)
        db.session.commit()
        notificacao_service.notificar_nova_oportunidade(nova_oportunidade)
        return nova_oportunidade.to_dict()
    except (AttributeError, TypeError, KeyError, ValueError):
        return None

def atualizar_oportunidade(oportunidade_id, data):
    oportunidade = db.session.get(Oportunidade, oportunidade_id)
    if not oportunidade:
        return None #oportunidade nao existe

    try:
        titulo = data.get("titulo")
        link_vaga = data.get("link_vaga")
        carga_horaria = data.get("cargaHoraria")
        requisitos = data.get("requisitos")
        observacoes = data.get("observacoes")

        if not titulo or not carga_horaria or not requisitos:
            return None #dados incompletos

        oportunidade.titulo = titulo
        oportunidade.link_vaga = link_vaga
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

def salvar_oportunidade(usuario_id, oportunidade_id):
    usuario = db.session.get(Usuario, usuario_id)   
    oportunidade = db.session.get(Oportunidade, oportunidade_id)

    if not usuario or not oportunidade:
        return False  # Usuário ou Oportunidade não encontrado

    if oportunidade not in usuario.oportunidades_salvas:
        usuario.oportunidades_salvas.append(oportunidade)
        db.session.commit()

    return True

def dessalvar_oportunidade(usuario_id, oportunidade_id):
    usuario = db.session.get(Usuario, usuario_id)
    oportunidade = db.session.get(Oportunidade, oportunidade_id)

    if not usuario or not oportunidade:
        return False

    if oportunidade in usuario.oportunidades_salvas:
        usuario.oportunidades_salvas.remove(oportunidade)
        db.session.commit()

    return True