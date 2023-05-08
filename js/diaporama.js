/*=================
**** Slideshow ****
*** diaporama.js **
=================*/



const Slideshow = {
	items : document.getElementsByClassName("slide"), // Récupère les classes "item" des balises <figure>
	diapoNum : 0, // Première slide
	playing : true,
	timer : setInterval(function(){
		Slideshow.next();
	}, 5000), // Toutes les cinq secondes



	next : function() {
		this.items[this.diapoNum].style.opacity = "0";
		if (this.diapoNum === this.items.length -1) {
			this.diapoNum = 0;
		} else {
			this.diapoNum++;
		}
		this.items[this.diapoNum].style.opacity = "1";
	},

	previous : function() {
		this.items[this.diapoNum].style.opacity = "0";
		if (this.diapoNum === 0) {
			this.diapoNum = this.items.length -1;
		} else {
			this.diapoNum--;
		}
		this.items[this.diapoNum].style.opacity = "1";
	},

	keysKeyboard : function(event) {
		if (event.keyCode === 39) {
        document.addEventListener("keydown", this.next()); // Appuyer sur suivant
    } else if (event.keyCode === 37) {
        document.addEventListener("keydown", this.previous()); // Appuyer sur précédent
    } else if ((event.keyCode === 13) || (event.keyCode === 19) || (event.keyCode === 32)) {
			document.addEventListener("keydown", this.pauseButton()); // Barre espace, touche Enter et Pause
		}
	},


	// Mise en pause et lecture
	pauseSlideshow: function() {
		this.playing = false;
		clearInterval(this.timer);
	},

	playSlideshow: function() {
		this.playing = true;
		this.timer = setInterval(function(){
			Slideshow.next();
		}, 5000);
	},

	pauseButton: function() {
			if(this.playing === true) {
				document.getElementById("pauseSlideImg").src = pauseSlideImg.src.replace("pause-blue", "play-blue");
				this.pauseSlideshow();
			}
			else {
				document.getElementById("pauseSlideImg").src = pauseSlideImg.src.replace("play-blue", "pause-blue");
				this.playSlideshow();
			}
	}

}


// Ajoute les événements au DOM, au clique et clavier
document.getElementById("arrowRight").addEventListener("click", Slideshow.next.bind(Slideshow));
document.getElementById("arrowLeft").addEventListener("click", Slideshow.previous.bind(Slideshow));
document.getElementById("pauseSlide").addEventListener("click", Slideshow.pauseButton.bind(Slideshow));
// Appui et relâchement d'une touche clavier
document.addEventListener("keydown", Slideshow.keysKeyboard.bind(Slideshow));
