import tkinter as tk
from tkinter import ttk, messagebox
import json
import os

DATA_FILE = os.path.join(os.path.dirname(__file__), 'parking_reservations.json')

class ParkingReservationSystem:
    def __init__(self):
        self.spots = {}
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


class ParkingGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Gestion du Parking Réservé")
        self.root.geometry("600x500")
        self.root.configure(bg="#f0f0f0")
        
        self.system = ParkingReservationSystem()
        
        self.setup_ui()
        self.refresh_display()

    def setup_ui(self):
        # Titre
        title = ttk.Label(self.root, text="Gestion du Parking Réservé", font=("Arial", 18, "bold"))
        title.pack(pady=15)

        # Frame supérieur pour les actions
        action_frame = ttk.LabelFrame(self.root, text="Actions", padding=10)
        action_frame.pack(padx=10, pady=10, fill="x")

        # Ajouter une place
        ttk.Label(action_frame, text="Ajouter une place:").grid(row=0, column=0, sticky="w", padx=5, pady=5)
        self.add_spot_entry = ttk.Entry(action_frame, width=20)
        self.add_spot_entry.grid(row=0, column=1, padx=5, pady=5)
        ttk.Button(action_frame, text="Ajouter", command=self.add_spot).grid(row=0, column=2, padx=5)

        # Réserver une place
        ttk.Label(action_frame, text="Réserver une place:").grid(row=1, column=0, sticky="w", padx=5, pady=5)
        self.reserve_spot_entry = ttk.Entry(action_frame, width=20)
        self.reserve_spot_entry.grid(row=1, column=1, padx=5, pady=5)
        ttk.Label(action_frame, text="Nom:").grid(row=2, column=0, sticky="w", padx=5, pady=5)
        self.reserve_name_entry = ttk.Entry(action_frame, width=20)
        self.reserve_name_entry.grid(row=2, column=1, padx=5, pady=5)
        ttk.Button(action_frame, text="Réserver", command=self.reserve_spot).grid(row=2, column=2, padx=5)

        # Libérer une place
        ttk.Label(action_frame, text="Libérer une place:").grid(row=3, column=0, sticky="w", padx=5, pady=5)
        self.release_spot_entry = ttk.Entry(action_frame, width=20)
        self.release_spot_entry.grid(row=3, column=1, padx=5, pady=5)
        ttk.Button(action_frame, text="Libérer", command=self.release_spot).grid(row=3, column=2, padx=5)

        # Frame pour l'affichage du statut
        status_frame = ttk.LabelFrame(self.root, text="État des Places", padding=10)
        status_frame.pack(padx=10, pady=10, fill="both", expand=True)

        # Texte avec scrollbar
        scrollbar = ttk.Scrollbar(status_frame)
        scrollbar.pack(side="right", fill="y")
        
        self.status_text = tk.Text(status_frame, height=15, width=70, yscrollcommand=scrollbar.set)
        self.status_text.pack(side="left", fill="both", expand=True)
        scrollbar.config(command=self.status_text.yview)

        # Boutons en bas
        button_frame = ttk.Frame(self.root)
        button_frame.pack(padx=10, pady=10, fill="x")

        ttk.Button(button_frame, text="Actualiser", command=self.refresh_display).pack(side="left", padx=5)
        ttk.Button(button_frame, text="Quitter", command=self.root.quit).pack(side="right", padx=5)

    def add_spot(self):
        spot_id = self.add_spot_entry.get().strip()
        if not spot_id:
            messagebox.showwarning("Erreur", "Veuillez entrer un identifiant de place.")
            return
        
        ok, msg = self.system.add_spot(spot_id)
        if ok:
            messagebox.showinfo("Succès", msg)
            self.add_spot_entry.delete(0, tk.END)
            self.refresh_display()
        else:
            messagebox.showerror("Erreur", msg)

    def reserve_spot(self):
        spot_id = self.reserve_spot_entry.get().strip()
        name = self.reserve_name_entry.get().strip()
        
        if not spot_id or not name:
            messagebox.showwarning("Erreur", "Veuillez remplir tous les champs.")
            return
        
        ok, msg = self.system.reserve_spot(spot_id, name)
        if ok:
            messagebox.showinfo("Succès", msg)
            self.reserve_spot_entry.delete(0, tk.END)
            self.reserve_name_entry.delete(0, tk.END)
            self.refresh_display()
        else:
            messagebox.showerror("Erreur", msg)

    def release_spot(self):
        spot_id = self.release_spot_entry.get().strip()
        if not spot_id:
            messagebox.showwarning("Erreur", "Veuillez entrer un identifiant de place.")
            return
        
        ok, msg = self.system.release_spot(spot_id)
        if ok:
            messagebox.showinfo("Succès", msg)
            self.release_spot_entry.delete(0, tk.END)
            self.refresh_display()
        else:
            messagebox.showerror("Erreur", msg)

    def refresh_display(self):
        self.status_text.config(state="normal")
        self.status_text.delete(1.0, tk.END)
        self.status_text.insert(1.0, self.system.status())
        self.status_text.config(state="disabled")


if __name__ == "__main__":
    root = tk.Tk()
    gui = ParkingGUI(root)
    root.mainloop()
