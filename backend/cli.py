import click
from werkzeug.security import generate_password_hash
from backend.extensions import db
from backend.model.admin import Admin

@click.command("criar-admin")
@click.argument("username")
@click.argument("password")

def criar_admin(username, password):
    if Admin.query.filter_by(username=username).first():
        click.echo("Username já existe.")
        return
    admin = Admin(username=username, senha_hash=generate_password_hash(password))
    db.session.add(admin)
    db.session.commit()
    click.echo(f"Admin '{username}' criado com sucesso.")

@click.command("resetar-senha-admin")
@click.argument("username")
@click.argument("nova_senha")
def resetar_senha_admin(username, nova_senha):
    admin = Admin.query.filter_by(username=username).first()
    if admin is None:
        click.echo(f"Admin '{username}' não encontrado.")
        return

    if len(nova_senha) < 6:
        click.echo("A senha deve ter pelo menos 6 caracteres.")
        return

    admin.senha_hash = generate_password_hash(nova_senha)
    db.session.commit()
    click.echo(f"Senha de '{username}' redefinida com sucesso.")