import json
import os
from datetime import datetime

DATA_FILE = os.path.join(os.path.dirname(__file__), 'parking_data.json')

class ParkingSystem:
    """Système de gestion de parking avancé"""
    
    def __init__(self):
        self.data = {
            'spots': {},
            'users': {},
            'history': [],
            'settings': {'total_spots': 10}
        }
        self._load()
    
    def _load(self):
        """Charger les données depuis le fichier JSON"""
        if os.path.exists(DATA_FILE):
            try:
                with open(DATA_FILE, 'r', encoding='utf-8') as f:
                    self.data = json.load(f)
            except Exception as e:
                print(f"Erreur de chargement: {e}")
                self.data = self._get_default_data()
        else:
            self.data = self._get_default_data()
    
    def _get_default_data(self):
        """Données par défaut"""
        return {
            'spots': {},
            'users': {'admin': {'password': 'admin', 'role': 'admin'}},
            'history': [],
            'settings': {'total_spots': 10}
        }
    
    def _save(self):
        """Sauvegarder les données"""
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(self.data, f, ensure_ascii=False, indent=2)
    
    def _add_history(self, action, details):
        """Ajouter une entrée à l'historique"""
        entry = {
            'timestamp': datetime.now().isoformat(),
            'action': action,
            'details': details
        }
        self.data['history'].append(entry)
        self._save()
    
    # ===== GESTION UTILISATEURS =====
    def create_user(self, username, password, role='user'):
        """Créer un nouvel utilisateur"""
        if username in self.data['users']:
            return False, f"Utilisateur '{username}' existe déjà."
        self.data['users'][username] = {'password': password, 'role': role}
        self._save()
        self._add_history('user_created', {'username': username, 'role': role})
        return True, f"Utilisateur '{username}' créé."
    
    def authenticate(self, username, password):
        """Authentifier un utilisateur"""
        if username not in self.data['users']:
            return False, "Utilisateur inexistant."
        if self.data['users'][username]['password'] != password:
            return False, "Mot de passe incorrect."
        return True, f"Bienvenue {username}!"
    
    def get_user_role(self, username):
        """Obtenir le rôle d'un utilisateur"""
        if username in self.data['users']:
            return self.data['users'][username].get('role', 'user')
        return None
    
    # ===== GESTION PLACES DE PARKING =====
    def add_spot(self, spot_id):
        """Ajouter une place"""
        if spot_id in self.data['spots']:
            return False, f"Place '{spot_id}' existe déjà."
        self.data['spots'][spot_id] = {
            'status': 'free',
            'reserved_by': None,
            'reserved_at': None
        }
        self._save()
        self._add_history('spot_added', {'spot_id': spot_id})
        return True, f"Place '{spot_id}' ajoutée."
    
    def delete_spot(self, spot_id):
        """Supprimer une place"""
        if spot_id not in self.data['spots']:
            return False, f"Place '{spot_id}' inexistante."
        if self.data['spots'][spot_id]['status'] == 'reserved':
            return False, f"Place '{spot_id}' est réservée. Libérez-la d'abord."
        
        del self.data['spots'][spot_id]
        self._save()
        self._add_history('spot_deleted', {'spot_id': spot_id})
        return True, f"Place '{spot_id}' supprimée."
    
    def reserve_spot(self, spot_id, username):
        """Réserver une place"""
        if spot_id not in self.data['spots']:
            return False, f"Place '{spot_id}' inexistante."
        if self.data['spots'][spot_id]['status'] == 'reserved':
            return False, f"Place réservée par {self.data['spots'][spot_id]['reserved_by']}."
        
        self.data['spots'][spot_id] = {
            'status': 'reserved',
            'reserved_by': username,
            'reserved_at': datetime.now().isoformat()
        }
        self._save()
        self._add_history('spot_reserved', {'spot_id': spot_id, 'username': username})
        return True, f"Place '{spot_id}' réservée pour {username}."
    
    def release_spot(self, spot_id):
        """Libérer une place"""
        if spot_id not in self.data['spots']:
            return False, f"Place '{spot_id}' inexistante."
        if self.data['spots'][spot_id]['status'] == 'free':
            return False, f"Place '{spot_id}' n'est pas réservée."
        
        reserved_by = self.data['spots'][spot_id]['reserved_by']
        self.data['spots'][spot_id] = {
            'status': 'free',
            'reserved_by': None,
            'reserved_at': None
        }
        self._save()
        self._add_history('spot_released', {'spot_id': spot_id, 'was_reserved_by': reserved_by})
        return True, f"Place '{spot_id}' libérée."
    
    def get_spot_status(self, spot_id):
        """Obtenir le statut d'une place"""
        if spot_id in self.data['spots']:
            return self.data['spots'][spot_id]
        return None
    
    def list_spots(self):
        """Lister toutes les places"""
        return self.data['spots']
    
    def get_statistics(self):
        """Obtenir les statistiques"""
        total = len(self.data['spots'])
        reserved = sum(1 for s in self.data['spots'].values() if s['status'] == 'reserved')
        free = total - reserved
        
        return {
            'total': total,
            'reserved': reserved,
            'free': free,
            'occupancy_rate': (reserved / total * 100) if total > 0 else 0
        }
    
    def get_history(self, limit=50):
        """Obtenir l'historique"""
        return self.data['history'][-limit:]
