# backend/service/admin_service.py
from werkzeug.security import check_password_hash, generate_password_hash
from backend.extensions import db
from backend.model.admin import Admin


def criar_admin(data):
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return None

    if Admin.query.filter_by(username=username).first():
        return None  # username já existe

    novo_admin = Admin(
        username=username,
        senha_hash=generate_password_hash(password)
    )
    db.session.add(novo_admin)
    db.session.commit()
    return novo_admin.to_dict()


def listar_admins(page=1, per_page=20):
    page = int(page or 1)
    per_page = int(per_page or 20)
    paginacao = Admin.query.paginate(page=page, per_page=per_page, error_out=False)
    return {
        "items": [admin.to_dict() for admin in paginacao.items],
        "total": paginacao.total,
        "page": page,
        "pages": paginacao.pages,
    }


def deletar_admin(admin_id):
    admin = Admin.query.get(admin_id)
    if admin is None:
        return None
    db.session.delete(admin)
    db.session.commit()
    return True

def alterar_senha(admin_id, senha_atual, senha_nova):
    admin = Admin.query.get(admin_id)
    if admin is None:
        return "nao_encontrado"

    if not check_password_hash(admin.senha_hash, senha_atual or ''):
        return "senha_incorreta"

    if not senha_nova or len(senha_nova) < 6:
        return "senha_invalida"

    admin.senha_hash = generate_password_hash(senha_nova)
    db.session.commit()
    return "sucesso"