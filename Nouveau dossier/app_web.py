from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from parking_system import ParkingSystem
import os

app = Flask(__name__)
CORS(app)  # Permettre les requêtes cross-origin

# Initialiser le système de parking
parking_system = ParkingSystem()

@app.route('/')
def index():
    """Page d'accueil"""
    return render_template('parking_web.html')

@app.route('/api/spots', methods=['GET'])
def get_spots():
    """Récupérer toutes les places"""
    try:
        spots = parking_system.list_spots()
        spots_list = []
        for spot_id, spot_data in spots.items():
            spots_list.append({
                'id': spot_id,
                'status': spot_data['status'],
                'reserved_by': spot_data.get('reserved_by'),
                'reserved_at': spot_data.get('reserved_at')
            })

        return jsonify({
            'success': True,
            'spots': spots_list
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/spots', methods=['POST'])
def add_spot():
    """Ajouter une nouvelle place"""
    try:
        data = request.get_json()
        if not data or 'id' not in data:
            return jsonify({
                'success': False,
                'message': 'ID de place requis'
            }), 400

        spot_id = data['id'].strip()
        if not spot_id:
            return jsonify({
                'success': False,
                'message': 'ID de place vide'
            }), 400

        success, message = parking_system.add_spot(spot_id)
        return jsonify({
            'success': success,
            'message': message
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/spots/<spot_id>/reserve', methods=['POST'])
def reserve_spot(spot_id):
    """Réserver une place"""
    try:
        data = request.get_json()
        if not data or 'name' not in data:
            return jsonify({
                'success': False,
                'message': 'Nom du réservataire requis'
            }), 400

        name = data['name'].strip()
        if not name:
            return jsonify({
                'success': False,
                'message': 'Nom vide'
            }), 400

        success, message = parking_system.reserve_spot(spot_id, name)
        return jsonify({
            'success': success,
            'message': message
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/spots/<spot_id>/release', methods=['DELETE'])
def release_spot(spot_id):
    """Libérer une place"""
    try:
        success, message = parking_system.release_spot(spot_id)
        return jsonify({
            'success': success,
            'message': message
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Récupérer les statistiques"""
    try:
        stats = parking_system.get_statistics()
        return jsonify({
            'success': True,
            'stats': {
                'total': stats['total'],
                'free': stats['free'],
                'reserved': stats['reserved'],
                'occupancy_rate': stats['occupancy_rate']
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/history', methods=['GET'])
def get_history():
    """Récupérer l'historique"""
    try:
        limit = request.args.get('limit', 50, type=int)
        history = parking_system.get_history(limit)
        return jsonify({
            'success': True,
            'history': history
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/calculator')
def calculator():
    """Page de la calculatrice"""
    return render_template('calculator.html')

@app.route('/api/calculate/<operation>', methods=['POST'])
def calculate(operation):
    """API pour les calculs mathématiques"""
    try:
        from function import AdvancedCalculator

        data = request.get_json()
        if not data or 'args' not in data:
            return jsonify({
                'success': False,
                'message': 'Arguments requis'
            }), 400

        calc = AdvancedCalculator()
        result = calc.calculate(operation, *data['args'])

        return jsonify({
            'success': True,
            'result': result,
            'operation': operation,
            'args': data['args']
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

if __name__ == '__main__':
    # Créer le dossier templates s'il n'existe pas
    if not os.path.exists('templates'):
        os.makedirs('templates')

    # Copier les fichiers HTML dans le dossier templates
    import shutil
    if os.path.exists('calculator.html'):
        shutil.copy('calculator.html', 'templates/calculator.html')
    if os.path.exists('parking_web.html'):
        shutil.copy('parking_web.html', 'templates/parking_web.html')

    print("🚀 Serveur web démarré sur http://localhost:5000")
    print("📊 Interface parking: http://localhost:5000/")
    print("🧮 Calculatrice: http://localhost:5000/calculator")

    app.run(debug=True, host='0.0.0.0', port=5000)