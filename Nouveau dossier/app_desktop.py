import tkinter as tk
from tkinter import ttk, messagebox, scrolledtext
from parking_system import ParkingSystem
from datetime import datetime
import json

class ParkingApp:
    """Application Desktop pour la gestion du parking"""
    
    def __init__(self, root):
        self.root = root
        self.root.title("Gestion du Parking - Application Desktop")
        self.root.geometry("900x700")
        self.root.resizable(True, True)
        
        # Gestion des erreurs et logging
        try:
            self.system = ParkingSystem()
            self.current_user = None
            self.current_role = None
            
            # Style
            style = ttk.Style()
            style.theme_use('clam')
            
            self._build_login_screen()
            
        except Exception as e:
            messagebox.showerror("Erreur d'initialisation", 
                               f"Impossible de démarrer l'application:\n{str(e)}")
            self.root.destroy()
            return
    
    def _clear_window(self):
        """Effacer tous les widgets"""
        for widget in self.root.winfo_children():
            widget.destroy()
    
    # ===== ÉCRAN DE CONNEXION =====
    def _build_login_screen(self):
        """Construire l'écran de connexion"""
        self._clear_window()
        
        # Message de bienvenue
        welcome = ttk.Label(self.root, text="🅿️ Bienvenue dans l'application de gestion du parking", 
                          font=('Arial', 12, 'bold'), foreground='#667eea')
        welcome.pack(pady=(20, 10))
        
        frame = ttk.Frame(self.root, padding=20)
        frame.pack(expand=True)
        
        title = ttk.Label(frame, text="🅿️ Gestion du Parking", font=('Arial', 20, 'bold'))
        title.grid(row=0, column=0, columnspan=2, pady=20)
        
        ttk.Label(frame, text="Utilisateur:").grid(row=1, column=0, sticky='w', pady=5)
        self.login_user_entry = ttk.Entry(frame, width=20)
        self.login_user_entry.grid(row=1, column=1, pady=5)
        self.login_user_entry.insert(0, "admin")
        
        ttk.Label(frame, text="Mot de passe:").grid(row=2, column=0, sticky='w', pady=5)
        self.login_pass_entry = ttk.Entry(frame, width=20, show="*")
        self.login_pass_entry.grid(row=2, column=1, pady=5)
        self.login_pass_entry.insert(0, "admin")
        
        ttk.Button(frame, text="Se connecter", command=self._login).grid(row=3, column=0, columnspan=2, pady=20)
        ttk.Button(frame, text="Créer un compte", command=self._show_register).grid(row=4, column=0, columnspan=2)
        
        # Bind Enter key
        self.login_pass_entry.bind('<Return>', lambda e: self._login())
    
    def _login(self):
        """Authentifier l'utilisateur"""
        username = self.login_user_entry.get().strip()
        password = self.login_pass_entry.get().strip()
        
        if not username or not password:
            messagebox.showerror("Erreur", "Veuillez remplir tous les champs.")
            return
        
        ok, msg = self.system.authenticate(username, password)
        if ok:
            self.current_user = username
            self.current_role = self.system.get_user_role(username)
            self._build_main_screen()
        else:
            messagebox.showerror("Erreur", msg)
    
    def _show_register(self):
        """Montrer l'écran d'inscription"""
        self._clear_window()
        
        # Message de bienvenue
        welcome = ttk.Label(self.root, text="🅿️ Créer un nouveau compte", 
                          font=('Arial', 12, 'bold'), foreground='#667eea')
        welcome.pack(pady=(20, 10))
        
        frame = ttk.Frame(self.root, padding=20)
        frame.pack(expand=True)
        
        title = ttk.Label(frame, text="Créer un compte", font=('Arial', 16, 'bold'))
        title.grid(row=0, column=0, columnspan=2, pady=20)
        
        ttk.Label(frame, text="Utilisateur:").grid(row=1, column=0, sticky='w', pady=5)
        reg_user_entry = ttk.Entry(frame, width=20)
        reg_user_entry.grid(row=1, column=1, pady=5)
        
        ttk.Label(frame, text="Mot de passe:").grid(row=2, column=0, sticky='w', pady=5)
        reg_pass_entry = ttk.Entry(frame, width=20, show="*")
        reg_pass_entry.grid(row=2, column=1, pady=5)
        
        def register_user():
            username = reg_user_entry.get().strip()
            password = reg_pass_entry.get().strip()
            
            if not username or not password:
                messagebox.showerror("Erreur", "Veuillez remplir tous les champs.")
                return
            
            ok, msg = self.system.create_user(username, password, role='user')
            if ok:
                messagebox.showinfo("Succès", msg)
                self._build_login_screen()
            else:
                messagebox.showerror("Erreur", msg)
        
        ttk.Button(frame, text="S'inscrire", command=register_user).grid(row=3, column=0, columnspan=2, pady=15)
        ttk.Button(frame, text="Retour", command=self._build_login_screen).grid(row=4, column=0, columnspan=2)
    
    # ===== ÉCRAN PRINCIPAL =====
    def _build_main_screen(self):
        """Construire l'écran principal avec onglets"""
        self._clear_window()
        
        # Barre de titre
        header = ttk.Frame(self.root)
        header.pack(fill='x', padx=10, pady=10)
        
        ttk.Label(header, text=f"🅿️ Gestion du Parking - {self.current_user} ({self.current_role})", 
                 font=('Arial', 14, 'bold')).pack(side='left')
        ttk.Button(header, text="Déconnexion", command=self._logout).pack(side='right')
        
        # Onglets
        self.notebook = ttk.Notebook(self.root)
        self.notebook.pack(fill='both', expand=True, padx=10, pady=10)
        
        # Onglet 1: Tableau de bord
        self._build_dashboard_tab(self.notebook)
        
        # Onglet 2: Gestion des places
        self._build_spots_tab(self.notebook)
        
        # Onglet 3: Historique
        self._build_history_tab(self.notebook)
        
        # Onglet 4: Statistiques
        self._build_stats_tab(self.notebook)
        
        if self.current_role == 'admin':
            # Onglet 5: Administration (admin seulement)
            self._build_admin_tab(self.notebook)
    
    def _build_dashboard_tab(self, notebook):
        """Onglet Tableau de bord"""
        frame = ttk.Frame(notebook)
        notebook.add(frame, text="📊 Tableau de bord")
        
        # Statistiques
        stats = self.system.get_statistics()
        
        info_frame = ttk.LabelFrame(frame, text="État général", padding=20)
        info_frame.pack(fill='x', padx=20, pady=20)
        
        ttk.Label(info_frame, text=f"Places totales: {stats['total']}", 
                 font=('Arial', 12)).pack(anchor='w', pady=5)
        ttk.Label(info_frame, text=f"Places réservées: {stats['reserved']}", 
                 font=('Arial', 12, 'bold'), foreground='red').pack(anchor='w', pady=5)
        ttk.Label(info_frame, text=f"Places libres: {stats['free']}", 
                 font=('Arial', 12, 'bold'), foreground='green').pack(anchor='w', pady=5)
        ttk.Label(info_frame, text=f"Taux d'occupation: {stats['occupancy_rate']:.1f}%", 
                 font=('Arial', 12)).pack(anchor='w', pady=5)
        
        # Actions rapides
        actions_frame = ttk.LabelFrame(frame, text="Actions rapides", padding=20)
        actions_frame.pack(fill='x', padx=20, pady=20)
        
        if self.current_role == 'admin':
            ttk.Button(actions_frame, text="➕ Ajouter une place", command=self._add_spot_quick).pack(anchor='w', pady=5)
        ttk.Button(actions_frame, text="📋 Voir toutes les places", command=self._show_spots_tab).pack(anchor='w', pady=5)
    
    def _add_spot_quick(self):
        """Ajouter rapidement une place"""
        dialog = tk.Toplevel(self.root)
        dialog.title("Ajouter une place")
        dialog.geometry("300x150")
        
        ttk.Label(dialog, text="ID de la place:").pack(pady=10)
        entry = ttk.Entry(dialog, width=20)
        entry.pack(pady=5)
        
        def add():
            spot_id = entry.get().strip()
            if not spot_id:
                messagebox.showerror("Erreur", "ID vide!")
                return
            ok, msg = self.system.add_spot(spot_id)
            messagebox.showinfo("Résultat", msg)
            dialog.destroy()
            self._refresh_spots_display()
        
        ttk.Button(dialog, text="Ajouter", command=add).pack(pady=10)
    
    def _show_spots_tab(self):
        """Aller à l'onglet des places"""
        self.notebook.select(1)  # Index 1 = onglet des places
    
    def _build_spots_tab(self, notebook):
        """Onglet Gestion des places"""
        frame = ttk.Frame(notebook)
        notebook.add(frame, text="🅿️ Places de parking")
        
        self.spots_frame = frame
        self._refresh_spots_display()
    
    def _refresh_spots_display(self):
        """Rafraîchir l'affichage des places"""
        for widget in self.spots_frame.winfo_children():
            widget.destroy()
        
        spots = self.system.list_spots()
        
        if not spots:
            ttk.Label(self.spots_frame, text="Aucune place. Ajoutez-en une!", 
                     font=('Arial', 12)).pack(pady=20)
            return
        
        # Scroll frame
        canvas = tk.Canvas(self.spots_frame)
        scrollbar = ttk.Scrollbar(self.spots_frame, orient='vertical', command=canvas.yview)
        scrollable_frame = ttk.Frame(canvas)
        
        scrollable_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )
        
        canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)
        
        for spot_id, spot_data in sorted(spots.items()):
            self._create_spot_widget(scrollable_frame, spot_id, spot_data)
        
        canvas.pack(side='left', fill='both', expand=True, padx=10, pady=10)
        scrollbar.pack(side='right', fill='y')
    
    def _create_spot_widget(self, parent, spot_id, spot_data):
        """Créer un widget pour une place"""
        spot_frame = ttk.Frame(parent, border=1, relief='solid')
        spot_frame.pack(fill='x', pady=5)
        
        status = spot_data['status']
        color = 'green' if status == 'free' else 'red'
        status_text = "✓ Libre" if status == 'free' else f"✗ Réservée ({spot_data['reserved_by']})"
        
        ttk.Label(spot_frame, text=f"Place: {spot_id}", font=('Arial', 11, 'bold')).pack(side='left', padx=10, pady=8)
        ttk.Label(spot_frame, text=status_text, foreground=color, font=('Arial', 10)).pack(side='left', padx=10)
        
        if status == 'free':
            ttk.Button(spot_frame, text="Réserver", 
                      command=lambda: self._reserve_spot_dialog(spot_id)).pack(side='right', padx=5, pady=5)
            if self.current_role == 'admin':
                ttk.Button(spot_frame, text="🗑️ Supprimer", 
                          command=lambda: self._delete_spot(spot_id)).pack(side='right', padx=5, pady=5)
        else:
            if self.current_user == spot_data['reserved_by'] or self.current_role == 'admin':
                ttk.Button(spot_frame, text="Libérer",
                          command=lambda: self._release_spot(spot_id)).pack(side='right', padx=5, pady=5)
    
    def _reserve_spot_dialog(self, spot_id):
        """Dialogue pour réserver une place"""
        dialog = tk.Toplevel(self.root)
        dialog.title(f"Réserver la place {spot_id}")
        dialog.geometry("300x150")
        
        ttk.Label(dialog, text=f"Place: {spot_id}").pack(pady=10)
        ttk.Label(dialog, text="Au nom de:").pack(pady=5)
        entry = ttk.Entry(dialog, width=20)
        entry.pack(pady=5)
        entry.insert(0, self.current_user)
        
        def reserve():
            name = entry.get().strip()
            if not name:
                messagebox.showerror("Erreur", "Nom vide!")
                return
            ok, msg = self.system.reserve_spot(spot_id, name)
            messagebox.showinfo("Résultat", msg)
            dialog.destroy()
            self._refresh_spots_display()
        
        ttk.Button(dialog, text="Réserver", command=reserve).pack(pady=10)
    
    def _release_spot(self, spot_id):
        """Libérer une place"""
        ok, msg = self.system.release_spot(spot_id)
        messagebox.showinfo("Résultat", msg)
        self._refresh_spots_display()
    
    def _delete_spot(self, spot_id):
        """Supprimer une place"""
        if messagebox.askyesno("Confirmation", f"Êtes-vous sûr de vouloir supprimer la place '{spot_id}' ?"):
            ok, msg = self.system.delete_spot(spot_id)
            if ok:
                messagebox.showinfo("Succès", msg)
                self._refresh_spots_display()
            else:
                messagebox.showerror("Erreur", msg)
    
    def _refresh_spots_tab(self):
        """Rafraîchir l'onglet des places"""
        self._refresh_spots_display()
    
    def _build_history_tab(self, notebook):
        """Onglet Historique"""
        frame = ttk.Frame(notebook)
        notebook.add(frame, text="📜 Historique")
        
        history = self.system.get_history()
        
        text_widget = scrolledtext.ScrolledText(frame, width=80, height=25, wrap=tk.WORD)
        text_widget.pack(fill='both', expand=True, padx=10, pady=10)
        text_widget.config(state='disabled')
        
        if not history:
            content = "Aucun historique."
        else:
            content = "HISTORIQUE DES ACTIONS\n" + "="*60 + "\n\n"
            for entry in reversed(history[-50:]):
                timestamp = entry.get('timestamp', 'N/A')
                action = entry.get('action', 'N/A')
                details = entry.get('details', {})
                content += f"[{timestamp}] {action}\n"
                content += f"  Détails: {json.dumps(details, ensure_ascii=False)}\n\n"
        
        text_widget.config(state='normal')
        text_widget.insert('1.0', content)
        text_widget.config(state='disabled')
    
    def _build_stats_tab(self, notebook):
        """Onglet Statistiques"""
        frame = ttk.Frame(notebook)
        notebook.add(frame, text="📈 Statistiques")
        
        stats = self.system.get_statistics()
        
        # Affichage des stats
        stats_frame = ttk.LabelFrame(frame, text="Résumé", padding=20)
        stats_frame.pack(fill='x', padx=20, pady=20)
        
        ttk.Label(stats_frame, text=f"Places totales: {stats['total']}", 
                 font=('Arial', 14, 'bold')).pack(anchor='w', pady=10)
        ttk.Label(stats_frame, text=f"Places réservées: {stats['reserved']}", 
                 font=('Arial', 14, 'bold'), foreground='red').pack(anchor='w', pady=10)
        ttk.Label(stats_frame, text=f"Places libres: {stats['free']}", 
                 font=('Arial', 14, 'bold'), foreground='green').pack(anchor='w', pady=10)
        
        # Barre de progression
        progress_frame = ttk.LabelFrame(frame, text="Taux d'occupation", padding=20)
        progress_frame.pack(fill='x', padx=20, pady=20)
        
        progress = ttk.Progressbar(progress_frame, length=400, mode='determinate', 
                                   value=stats['occupancy_rate'])
        progress.pack(fill='x', pady=10)
        
        ttk.Label(progress_frame, text=f"{stats['occupancy_rate']:.1f}%", 
                 font=('Arial', 12, 'bold')).pack(anchor='w')
    
    def _build_admin_tab(self, notebook):
        """Onglet Administration (admin seulement)"""
        frame = ttk.Frame(notebook)
        notebook.add(frame, text="⚙️ Administration")
        
        ttk.Label(frame, text="Administration du système", font=('Arial', 14, 'bold')).pack(pady=20)
        
        # Gestion utilisateurs
        users_frame = ttk.LabelFrame(frame, text="Utilisateurs", padding=20)
        users_frame.pack(fill='x', padx=20, pady=10)
        
        users_text = scrolledtext.ScrolledText(users_frame, width=60, height=10, wrap=tk.WORD)
        users_text.pack(fill='both', expand=True)
        users_text.config(state='disabled')
        
        content = "UTILISATEURS\n" + "="*40 + "\n\n"
        for username, user_data in self.system.data['users'].items():
            content += f"👤 {username} ({user_data.get('role', 'user')})\n"
        
        users_text.config(state='normal')
        users_text.insert('1.0', content)
        users_text.config(state='disabled')
        
        # Actions admin
        actions_frame = ttk.LabelFrame(frame, text="Actions", padding=20)
        actions_frame.pack(fill='x', padx=20, pady=10)
        
        ttk.Button(actions_frame, text="Initialiser les places (1-10)", 
                  command=self._init_spots).pack(anchor='w', pady=5)
    
    def _init_spots(self):
        """Initialiser les places"""
        for i in range(1, 11):
            self.system.add_spot(f"A{i:02d}")
        messagebox.showinfo("Succès", "Places A01 à A10 créées!")
        self._refresh_spots_display()
    
    def _logout(self):
        """Déconnexion"""
        self.current_user = None
        self.current_role = None
        self._build_login_screen()

if __name__ == '__main__':
    try:
        root = tk.Tk()
        app = ParkingApp(root)
        root.mainloop()
    except Exception as e:
        print(f"Erreur fatale: {e}")
        import traceback
        traceback.print_exc()
        input("Appuyez sur Entrée pour quitter...")
