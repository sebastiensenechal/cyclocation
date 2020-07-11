// *************************
// **** Web Storage API ****
// Conserver la réservation
// *** durant 20 minutes ***
// *************************+

var BookingTimer = {
  minutes : 30, // Durée de réservation 20 min
  seconds : 00, // Secondes du compte à rebours "countdown"
  minutesElt : null, // Minutes à insérer dans le DOM
  secondsElt : null, // Secondes à insérer dans le DOM
  countdown : null, // Compte à rebours
  nameStation : null,

  validateBooking: function() {
    // Vérification d'une réservation existante
    if ((localStorage.getItem("firstname")) && (localStorage.getItem("lastname")) && (SignCanvas.reservation)) {
      if(sessionStorage.getItem("minutes")) { // Si une réservation existe
          // Suppression de la réservation existante
          this.reset();
          console.log(`Reset, début de la nouvelle réservation sur ${this.nameStation}`);
      } else { // Aucune réservation n'existe
          // Lance la méthode de lancement de la réservation
          this.startBooking();
          console.log(`Démarrer réservation sur ${this.nameStation}`);
      }
    } else {
      document.getElementById("missingInfo").style.display = "block";
    }
  },

  startBooking: function() {
    sessionStorage.setItem("minutes", this.minutes);
    sessionStorage.setItem("seconds", this.seconds);
    sessionStorage.setItem("nameStation", Station.name);
    this.nameStation = sessionStorage.getItem("nameStation");

    // On retire un vélo et ajoute une place libre
    document.getElementById("veloDispo").innerHTML = Station.nbBicycle - 1;
    document.getElementById("attacheDispo").innerHTML = Station.nbAttachment + 1;

    // Affichage de la réservation et du timer
    this.bookingInfo();
    this.countdown = setInterval("BookingTimer.initCountdown()", 1000);
  },

  bookingInfo: function() {
    document.getElementById("reservationBlock").style.display = "none";
    document.getElementById("infoBeforeBooking").style.display = "none";
    document.getElementById("reservationValide").style.display = "block";
    document.getElementById("stationReservation").innerHTML = this.nameStation;
    document.getElementById("lastnameReservation").innerHTML = localStorage.getItem("lastname");
    document.getElementById("firstnameReservation").innerHTML = localStorage.getItem("firstname");
  },


  initCountdown: function() {
    if (this.minutes < 10) {
      this.minutesElt = "0" + this.minutes;
    } else {
      this.minutesElt = this.minutes;
    }

    if (this.seconds < 10) {
      this.secondsElt = "0" + this.seconds;
    } else {
      this.secondsElt = this.seconds;
    }
    document.getElementById("missingInfo").style.display = "none";
    document.getElementById("reservationTimer").innerHTML = this.minutesElt + ":" + this.secondsElt;
    this.countdownStart();
  },


  countdownStart: function() {
    if ((this.minutes >= 0) && (this.seconds > 0)) {
      this.seconds--;
      sessionStorage.setItem("seconds", this.seconds);

    } else if ((this.minutes > 0) && (this.seconds <= 0)) {
      this.seconds = 59;
      this.minutes--;

      sessionStorage.setItem("minutes", this.minutes);
      sessionStorage.setItem("seconds", this.seconds);

    } else if ((this.minutes === 0) && (this.seconds === 0)) {
      document.getElementById("reservationValide").style.display = "none";
      this.bookingFinish();
    }
  },

  bookingFinish: function() {
    clearInterval(this.countdown);

    // Remise à zéro
    this.minutes = 30;
    this.seconds = 00;
    this.minutesElt = null;
    this.secondsElt = null;
    document.getElementById("veloDispo").innerHTML = Station.nbBicycle;
    document.getElementById("attacheDispo").innerHTML = Station.nbAttachment;

    // Vider le stockage local
    sessionStorage.removeItem("minutes")
    sessionStorage.removeItem("seconds");
    sessionStorage.removeItem("nameStation");

    document.getElementById("reservationBlock").style.display = "none";
    document.getElementById("listeInfo").style.display = "none";
    document.getElementById("infoBeforeBooking").style.display = "block";
    document.getElementById("reservationValide").style.display = "none";
    document.getElementById("buttonReserv").style.display = "none";
  },

  cancel: function() {
    console.log(`Annulation de la réservation à la station ${this.nameStation}`);
    this.bookingFinish();
  },

  bookingCheck: function() {
    // On vérifie que la réservation n'est pas déjà en cours et stockée
    if(sessionStorage.getItem("minutes")) {
      this.minutes = sessionStorage.getItem("minutes");
      this.seconds = sessionStorage.getItem("seconds");
      this.nameStation = sessionStorage.getItem("nameStation");

      // Relance le compte à rebours
      this.countdown = setInterval("BookingTimer.initCountdown()", 1000);

      document.getElementById("reservationTimer").innerHTML = this.minutesElt + ":" + this.secondsElt;
      document.getElementById("reservationBlock").style.display = "block";
    } else {
      document.getElementById("reservationBlock").style.display = "none";
    }
  },

  reset: function() {
      sessionStorage.removeItem("minutes")
      sessionStorage.removeItem("seconds");
      sessionStorage.removeItem("nameStation");

      clearInterval(this.countdown);

      this.minutes = 30;
      this.seconds = 00;
      this.minutesElt = null;
      this.secondsElt = null;
      // Retour au lancement de la réservation
      this.startBooking();
  }

};




// Vérification de l'existence d'une réservation au chargement du DOM
BookingTimer.bookingCheck();


// Bouton "Je réserve", valider la réservation.
var buttonValid = document.getElementById("buttonValid");
buttonValid.addEventListener("click", function() {
  BookingTimer.validateBooking();
});

// Bouton "Réserver", affichage formulaire et canvas.
var buttonReserv = document.getElementById("buttonReserv");
buttonReserv.addEventListener("click", function() {
  if (Station.reservation === true) {
    document.getElementById("reservationBlock").style.display = "block";
    document.getElementById("errorReserv").style.display = "none";
    document.getElementById("buttonReserv").style.display = "none";
  } else {
    document.getElementById("errorReserv").style.display = "block";
    document.getElementById("reservationBlock").style.display = "none";
  }
});

// Bouton "J'annule ma réservation"
var buttonCancel = document.getElementById("buttonCancel");
buttonCancel.addEventListener("click", function() {
  BookingTimer.cancel();
});





var StorageForm = {
  storageAvailable: function(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // tout sauf Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // tout sauf Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
    }
  },

  initStorage: function() {
    if (this.storageAvailable('localStorage')) {
      console.log("localStorage est autorisé");
      if (!localStorage.getItem('firstname')) {
        this.populateStorage();
      } else {
        this.setStyle();
      }
      if (!localStorage.getItem('lastname')) {
        this.populateStorage();
      } else {
        this.setStyle();
      }
    } else {
      console.log("localStorage n'est pas autorisé");
    }
  },

  currentFirstname: null,
  currentLastname: null,

  setStyle: function() {
    this.currentFirstname = localStorage.getItem("firstname");
    this.currentLastname = localStorage.getItem("lastname");

    document.getElementById("firstname").value = this.currentFirstname;
    document.getElementById("lastname").value = this.currentLastname;

    document.getElementById("firstname").textContent = this.currentFirstname;
    document.getElementById("lastname").textContent = this.currentLastname;
  },

  populateStorage: function() {
      localStorage.setItem("firstname", document.getElementById("firstname").value);
      localStorage.setItem("lastname", document.getElementById("lastname").value);
      this.setStyle();
  }
}
StorageForm.initStorage();
