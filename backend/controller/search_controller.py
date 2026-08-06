from flask import Blueprint, app, request, jsonify
from backend.service.search_service import pesquisar_noticias, pesquisar_editais, pesquisar_oportunidades

search_bp = Blueprint('search', __name__, url_prefix='/search')


@search_bp.route('/noticias', methods=['GET'])
def api_pesquisar_noticias():
    termo = request.args.get('q', '')
        
    if not termo:
        return jsonify({"erro": "Digite algo para pesquisar"}), 400
        
    resultados = pesquisar_noticias(termo)
        
    return jsonify({
        "termo": termo,
        "tipo": "noticias",
        "total": len(resultados),
        "resultados": [noticia.to_dict() for noticia in resultados]
    })
    
@search_bp.route('/editais', methods=['GET'])
def api_pesquisar_editais():
    termo = request.args.get('q', '')
        
    if not termo:
        return jsonify({"erro": "Digite algo para pesquisar"}), 400
        
    resultados = pesquisar_editais(termo)
        
    return jsonify({
        "termo": termo,
        "tipo": "editais",
        "total": len(resultados), 
        "resultados": [edital.to_dict() for edital in resultados]
    })
    
@search_bp.route('/oportunidades', methods=['GET'])
def api_pesquisar_oportunidades():
    termo = request.args.get('q', '')
        
    if not termo:
        return jsonify({"erro": "Digite algo para pesquisar"}), 400
        
    resultados = pesquisar_oportunidades(termo)
        
    return jsonify({
        "termo": termo,
        "tipo": "oportunidades",
        "total": len(resultados),
        "resultados": [op.to_dict() for op in resultados]
    })
