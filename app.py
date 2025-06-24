from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from pony.orm import db_session
from models import db, Raspolozenje
from datetime import datetime
import os

app = Flask(__name__, static_folder='frontend')
CORS(app)

@app.route('/api/raspolozenja', methods=['GET'])
@db_session
def get_all():
    result = [r.to_dict() for r in Raspolozenje.select()]
    return jsonify(result)

@app.route('/api/raspolozenja', methods=['POST'])
@db_session
def add_entry():
    data = request.json
    r = Raspolozenje(
        datum=datetime.fromisoformat(data['datum']),
        ocjena=data['ocjena'],
        opis=data.get('opis'),
        datum_kreiranja=datetime.now(),
        datum_promjene=datetime.now()
    )
    return jsonify(r.to_dict()), 201

@app.route('/api/raspolozenja/<int:entry_id>', methods=['PUT'])
@db_session
def update_entry(entry_id):
    data = request.json
    r = Raspolozenje.get(id=entry_id)
    if not r:
        return jsonify({'error': 'Not found'}), 404
    r.ocjena = data['ocjena']
    r.opis = data.get('opis')
    r.datum = datetime.fromisoformat(data['datum'])
    r.datum_promjene = datetime.now()
    return jsonify(r.to_dict())

@app.route('/api/raspolozenja/<int:entry_id>', methods=['DELETE'])
@db_session
def delete_entry(entry_id):
    r = Raspolozenje.get(id=entry_id)
    if not r:
        return jsonify({'error': 'Not found'}), 404
    r.delete()
    return '', 204

# Frontend serve: /
@app.route('/')
def serve_index():
    return send_from_directory('frontend', 'index.html')

# Posluži ostale frontend datoteke (script.js, style.css...)
@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('frontend', filename)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
