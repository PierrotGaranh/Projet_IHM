import json
import os

DATA_FILE = os.path.join(os.path.dirname(__file__), 'parking_reservations.json')

class ParkingReservationSystem:
    def __init__(self):
        self.spots = {}  # spot_id -> {'status': 'free'/'reserved', 'reserved_by': str}
        self._load()

    def _load(self):
        if os.path.exists(DATA_FILE):
            try:
                with open(DATA_FILE, 'r', encoding='utf-8') as f:
                    self.spots = json.load(f)
            except Exception:
                self.spots = {}

    def _save(self):
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(self.spots, f, ensure_ascii=False, indent=2)
            

    def add_spot(self, spot_id):
        if spot_id in self.spots:
            return False, f"Place '{spot_id}' existe déjà."
        self.spots[spot_id] = {'status': 'free', 'reserved_by': None}
        self._save()
        return True, f"Place '{spot_id}' ajoutée."

    def reserve_spot(self, spot_id, name):
        if spot_id not in self.spots:
            return False, f"Place '{spot_id}' inexistante."
        if self.spots[spot_id]['status'] == 'reserved':
            return False, f"Place '{spot_id}' est déjà réservée par {self.spots[spot_id]['reserved_by']}."
        self.spots[spot_id] = {'status': 'reserved', 'reserved_by': name}
        self._save()
        return True, f"Place '{spot_id}' réservée pour {name}."

    def release_spot(self, spot_id):
        if spot_id not in self.spots:
            return False, f"Place '{spot_id}' inexistante."
        if self.spots[spot_id]['status'] == 'free':
            return False, f"Place '{spot_id}' n'est pas réservée."
        self.spots[spot_id] = {'status': 'free', 'reserved_by': None}
        self._save()
        return True, f"Place '{spot_id}' libérée."

    def status(self):
        lines = []
        for spot_id in sorted(self.spots.keys()):
            spot = self.spots[spot_id]
            if spot['status'] == 'free':
                lines.append(f"{spot_id}: libre")
            else:
                lines.append(f"{spot_id}: réservé par {spot['reserved_by']}")
        if not lines:
            lines.append("Aucune place gérée.")
        return "\n".join(lines)

    def list_reserved(self):
        return {k: v for k, v in self.spots.items() if v['status'] == 'reserved'}


def main():
    sys = ParkingReservationSystem()

    menu = """
Gestion du parking réservé
1) Ajouter place
2) Réserver place
3) Libérer place
4) État des places
5) Quitter
"""

    while True:
        print(menu)
        choice = input('Choix: ').strip()
        if choice == '1':
            spot = input('Identifiant de la place : ').strip()
            ok, msg = sys.add_spot(spot)
            print(msg)
        elif choice == '2':
            spot = input('Identifiant de la place : ').strip()
            name = input('Nom du réservataire : ').strip()
            ok, msg = sys.reserve_spot(spot, name)
            print(msg)
        elif choice == '3':
            spot = input('Identifiant de la place : ').strip()
            ok, msg = sys.release_spot(spot)
            print(msg)
        elif choice == '4':
            print(sys.status())
        elif choice == '5':
            print('Fin.')
            break
        else:
            print('Option inconnue. Veuillez réessayer.')


if __name__ == '__main__':
    main()
