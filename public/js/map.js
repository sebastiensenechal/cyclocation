/*=================
Carte intéractive
=> map2.js
=================*/

// Affichage de la carte avec Leaflet et layers OpenStreetMap
// Données OpenData de JCDecaux

// 1. Déclaration des variables de la carte
// 2. Objet carte
// --- 2a. Propriétés latitude, longitude, pour centrer la carte au chargement
// --- 2b. Méthode d'initialisation de la carte (création de la carte sur l'ID "map" du DOM et récupération des Layers "tiles" d'OpenStreetMap).
// --- 2c. Méthode d'initialisation des markers. Une fonction prend en paramètre la position des markers depuis l'appel AJAX sur JCDecaux.
// 3. Objet stations
// --- 3a. Propriétés nom, etat, nbVelo, nbAttache, reservation sur null. En attente d'instructions.
// --- 3b. Méthode ajaxGet pour être utilisé plus tard.
// --- 3c. Méthode pour traiter les données récupérées (état, nom, etc.)
// --- 3d. Méthode d'insertion dans le DOM des données traitées précédement.
// --- 3e. Méthode pour vérifier le statut d'une station et la possibilité de réserver.
// 4. Appel "ajaxGet" de l'objet Station, avec l'url JCDecaux et une fonction.
// URL : https://api.jcdecaux.com/vls/v1/stations?contract=creteil&apiKey=d695fb95bd1b81a4415ff3959521a2dc5d57e2f1
// --- 4a. Stockage des données dans la variable listStations à l'aide de JSON.parse (Données textuelles)
// --- 4b. Boucle pour parcourir les données de listStations

var mapCyclo = null;
var mapLayer = null;
var markers;

var Maps = {
	// Ville de Nantes
	lat: 47.21537,
	lon: -1.55551,

	initMap : function() {
		// Stockage de la carte dans la variable mapCyclo. La fonction de L.map prend plusieurs paramètres. La fonction setView le centrage de la carte et la zoom.
		mapCyclo = L.map(document.getElementById('map'), {scrollWheelZoom:false}).setView([this.lat, this.lon], 13);

		// Fond de carte. Récupération des "tiles" d'OpenStreetMap
		mapLayer = L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", {
			attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">CartoDB</a>',
			minZoom: 8,
			maxZoom: 20
		}).addTo(mapCyclo);
	},

  // Méthode d'initialisation des markers : Récupère les données stockées dans la variable "listStations"
  initMarkers : function(positionStation) {
      markers = L.marker([positionStation.lat, positionStation.lng]).addTo(mapCyclo);
  }

}





var Station = {
  name: null,
	statusStation: null,
	nbBicycle: null,
	nbAttachment: null,
	reservation : null,

  // Requête HTTP en AJAX pour récupérer les données de JC Decaux
  ajaxGet: function(url, callback) {
    // Création d'une requête http
    var req = new XMLHttpRequest();
    // Requête HTTP GET asynchrone vers JC Decaux
    req.open("GET", url); // https://api.jcdecaux.com/vls/v1/stations?contract=creteil&apiKey=d695fb95bd1b81a4415ff3959521a2dc5d57e2f1
    // Sécurité : Gestion de l'événement indiquant la fin de la requête
    req.addEventListener("load", function() {
      // Affiche la réponse reçue pour la requête
      if ((req.status >= 200) && (req.status < 400)) {
        console.log(req.responseText);
        callback(req.responseText);
      } else {
        console.error(req.status + " " + req.statusText + " " + url);
      }
    });
    req.addEventListener("error", function(){
      console.error(`Erreur réseau avec l'URL ${url}`);
    });
    // Envoi de la requête
    req.send(null);
  },



    dataSations : function(dataStation) {
        this.name = dataStation.name;
        this.statusStation = dataStation.status;
        this.nbBicycle = dataStation.available_bikes;
        this.nbAttachment = dataStation.available_bike_stands;
    },



    inserDataStation : function() {
        // Insertion des données dans la page
        document.getElementById("nomStation").innerHTML = this.name;
        document.getElementById("etatStation").innerHTML = this.statusStation; // Status ouverte ou fermée
        document.getElementById("veloDispo").innerHTML = this.nbBicycle;
        document.getElementById("attacheDispo").innerHTML = this.nbAttachment;
    },



		verifReservation : function() {
			if ((this.statusStation === "CLOSED") && (this.nbBicycle === 0)) {
				document.getElementById("etatStation").style.color = "rgb(241, 94, 94)";
				document.getElementById("veloDispo").style.color = "rgb(241, 94, 94)";
				this.reservation = false;
			} else if ((this.statusStation === "OPEN") && (this.nbBicycle > 0)) {
				document.getElementById("etatStation").style.color = "#9700ff";
				document.getElementById("veloDispo").style.color = "#9700ff";
				this.reservation = true;
			} else if ((this.statusStation === "OPEN") && (this.nbBicycle === 0)) {
				document.getElementById("etatStation").style.color = "#9700ff";
				document.getElementById("veloDispo").style.color = "rgb(241, 94, 94)";
				this.reservation = false;
			} else if ((this.statusStation === "CLOSED") && (this.nbBicycle > 0)) {
				document.getElementById("etatStation").style.color = "rgb(241, 94, 94)";
				document.getElementById("veloDispo").style.color = "#9700ff";
				this.reservation = false;
			}
		}
}


// Appel de la méthode Ajax et récupération de la liste des stations
Station.ajaxGet("https://api.jcdecaux.com/vls/v1/stations?contract=Nantes&apiKey=d695fb95bd1b81a4415ff3959521a2dc5d57e2f1", function(response) {
    var listStations = JSON.parse(response);

    // Parcours les données des stations
    listStations.forEach(function(responseInfoStation) {

        // Appel de la méthode initMarkers pour positionner les marqueurs sur la carte
        Maps.initMarkers(responseInfoStation.position);

				function clicMarkers() {
					// mapCyclo.dragging.disable();
					Station.dataSations(responseInfoStation); // Traitement des données pour apparition sur le DOM
					Station.inserDataStation();  // Insertion des données dans le bloc listeInfos
					Station.verifReservation(); // Statut de la station pour autoriser ou non la réservation
					// A chaque clique sur un marker, on change le style de...
					document.getElementById("errorReserv").style.display = "none";
					document.getElementById("reservationBlock").style.display = "none";
					document.getElementById("buttonReserv").style.display = "inline-block";
					document.getElementById("missingInfo").style.display = "none";
					document.getElementById("listeInfo").style.display = "block";
					document.getElementById("infoBeforeBooking").style.display = "none";
				}

				markers.addEventListener("click", clicMarkers);
    }); // Fermeture de la boucle pour le parcours des données des stations


		// Masquer par défaut les zones de réservation
		document.getElementById("reservationBlock").style.display = "none";
		document.getElementById("errorReserv").style.display = "none";
		if (sessionStorage.getItem("minutes")) {
			BookingTimer.bookingInfo();
		} else {
			document.getElementById("reservationValide").style.display = "none";
			document.getElementById("infoBeforeBooking").style.display = "block";
		}
		document.getElementById("buttonReserv").style.display = "none";
		document.getElementById("missingInfo").style.display = "none";
		document.getElementById("listeInfo").style.display = "none";

});

// Initialise la map au chargement de la page
// window.onload = function() { Maps.initMap(); };
