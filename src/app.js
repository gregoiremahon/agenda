var app = new Vue({
    el: '#app',
    data: {
        evenements: [],
        nouvelEvenement: { titre: '', description: '', debut: '', fin: '' },
        calendar: null,
        evenementAmodifier: null,
        userConnected: false,
        nomUtilisateur: '',
        motDePasse: '',
        utilisateurConnecte: null,
        showAccountCreationModal: false,
        showLoginModal: false,
        showEventForm: false,
        nouvelUtilisateur: {
            nom: '',
            motDePasse: ''
        },
    },
    mounted() {
        if(this.utilisateurConnecte) this.chargerEvenements();
        document.addEventListener('keydown', this.handleEscape);
    },
    beforeDestroy() {
        document.removeEventListener('keydown', this.handleEscape);
    },
    methods: {

        toggleModals() {
            this.showAccountCreationModal = false;
            this.showLoginModal = true;
        },

        async connecterUtilisateur() { // fonction pour la connexion d'un utilisateur.
            try {
                const response = await fetch('/connectUser.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        nom: this.nomUtilisateur,
                        motDePasse: this.motDePasse 
                    })
                });
                const result = await response.json();
                if (result.status === 'success') {
                    this.utilisateurConnecte = result.utilisateur;
                    this.userConnected = true;
                    this.showLoginModal = false;
                    this.chargerEvenements(); // Recharger les événements pour l'utilisateur connecté
                } else {
                    this.userConnected = false;
                    console.error(result.message);
                }
            } catch (error) {
                alert("Erreur lors de la connexion : " + error + "Veuillez réessayer.");
                console.error('Erreur lors de la connexion:', error);
            }
        },
        async createUser() {
            console.log(this.nouvelUtilisateur);
            try {
                const response = await fetch('/createUser.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(this.nouvelUtilisateur)
                });
                this.showAccountCreationModal = false;
            } catch (error) {
                console.error('Erreur lors de la création du compte:', error);
            }
        },
        async chargerEvenements() {
            try {
                const response = await fetch('/getEvents.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ utilisateurId: this.utilisateurConnecte.id })
                });
                this.evenements = await response.json();
                this.initialiserCalendrier();
            } catch (error) {
                console.error('Erreur lors du chargement des événements:', error);
            }
        },
        async ajouterEvenement() {
            if (!this.utilisateurConnecte) return;
            try {
                const response = await fetch('/addEvent.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...this.nouvelEvenement, utilisateurId: this.utilisateurConnecte.id })
                });
                const result = await response.json();
                if (result.status === 'success') {
                    this.chargerEvenements();
                    this.showEventForm = false;
                    this.nouvelEvenement = { titre: '', description: '', debut: '', fin: '' }; // Réinitialiser le formulaire
                    console.log("Evenement ajouté ! ", this.nouvelEvenement);
                } else {
                    console.error(result.message);
                }
            } catch (error) {
                console.error('Erreur lors de l\'ajout de l\'événement:', error);
            }
            
        },
        initialiserCalendrier() {
            if (this.calendar) {
                this.calendar.destroy(); // Détruire l'instance existante
            }
        
            this.calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {
                initialView: 'dayGridMonth',
                events: this.evenements.map(evenement => ({
                    id: evenement.id,
                    title: evenement.titre,
                    start: evenement.debut,
                    end: evenement.fin,
                    extendedProps: {
                        description: evenement.description
                    }
                })),

                eventClick: (info) => {
                    const evenementModifie = {
                        id: info.event.id,
                        titre: info.event.title,
                        description: info.event.extendedProps.description,
                        debut: info.event.start.toISOString().slice(0, 16),
                        fin: info.event.end ? info.event.end.toISOString().slice(0, 16) : ''
                    };
        
                    // Ouvrir la modal avec les détails de l'événement
                    this.evenementAmodifier = evenementModifie;
                    //this.openUpdateEventModal(evenementModifie);
                }
            });
        
            this.calendar.render();
        },
        
        async supprimerEvenement(id) {
            if (!this.utilisateurConnecte) return;
            try {
                const response = await fetch('/deleteEvent.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id, utilisateurId: this.utilisateurConnecte.id })
                });
                const result = await response.json();
                if (result.status === 'success') {
                    this.chargerEvenements();
                } else {
                    console.error(result.message);
                }
            } catch (error) {
                console.error('Erreur lors de la suppression de l\'événement:', error);
            }
        },
        
        openUpdateEventModal(evenement) {
            this.evenementAmodifier = Vue.util.extend({}, evenement);
        },

        closeUpdateEventModal() {
            this.evenementAmodifier = null;
        },

        handleEscape(e) {
            if (e.key === 'Escape' && this.evenementAmodifier) {
                this.closeUpdateEventModal();
            }
        },

        async modifierEvenement(evenementModifie) {
            if (!this.utilisateurConnecte) return;
            try {
                const response = await fetch('/updateEvent.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...evenementModifie, utilisateurId: this.utilisateurConnecte.id })
                });
                const result = await response.json();
                if (result.status === 'success') {
                    this.chargerEvenements();
                    console.log("Événement modifié avec succès");
                } else {
                    console.error(result.message);
                }
            } catch (error) {
                console.error('Erreur lors de la modification de l\'événement:', error);
            }
            this.closeUpdateEventModal(); // reset l'evenement à modifier
        },
    }
});
