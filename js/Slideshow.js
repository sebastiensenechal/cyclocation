class Slideshow {

    constructor(items, duration) {
        this.items = document.getElementsByClassName(items); // DOM element for slide
        this.diapoNum = 0;
        this.playing = true; // Booleen
        this.duration = duration;
        this.autoplay = this.autoPlay();
        this.keysKeyboard = document.addEventListener("keydown", this.keysKeyboard.bind(this));
    }

    autoPlay() {
        this.timer = setInterval(this.next.bind(this), this.duration);
        // Millisecondes par tour, 5 secondes par défaut
        console.log('Autoplay : ' + this.playing);
    } 

    next() {
        this.items[this.diapoNum].style.opacity = "0";
		if (this.diapoNum === this.items.length -1) {
			this.diapoNum = 0;
		} else {
			this.diapoNum++;
		}
		this.items[this.diapoNum].style.opacity = "1";
    }

    previous() {
		this.items[this.diapoNum].style.opacity = "0";
		if (this.diapoNum === 0) {
			this.diapoNum = this.items.length -1;
		} else {
			this.diapoNum--;
		}
		this.items[this.diapoNum].style.opacity = "1";
	}

    // Mise en pause et lecture
	pauseSlideshow() {
		this.playing = false;
		clearInterval(this.timer);
        console.log('Autoplay : ' + this.playing);
	}

    playSlideshow() {
		this.playing = true;
		this.autoPlay();
	}

	pauseButton() {
		if (this.playing === true) {
			document.getElementById("pauseSlideImg").src = pauseSlideImg.src.replace("pause-blue", "play-blue");
			this.pauseSlideshow();
		}
		else {
			document.getElementById("pauseSlideImg").src = pauseSlideImg.src.replace("play-blue", "pause-blue");
			this.playSlideshow();
		}
	}

    keysKeyboard(event) {
		if (event.keyCode === 39) {
        document.addEventListener("keydown", this.next()); // Appuyer sur suivant
    } else if (event.keyCode === 37) {
        document.addEventListener("keydown", this.previous()); // Appuyer sur précédent
    } else if ((event.keyCode === 13) || (event.keyCode === 19) || (event.keyCode === 32)) {
			document.addEventListener("keydown", this.pauseButton()); // Barre espace, touche Enter et Pause
		}
	}
    
}

const slideshow = new Slideshow("slide", 5000);
// slideshow.autoPlay(5000);

document.getElementById("pauseSlide").addEventListener("click", slideshow.pauseButton.bind(slideshow));
document.getElementById("arrowRight").addEventListener("click", slideshow.next.bind(slideshow));
document.getElementById("arrowLeft").addEventListener("click", slideshow.previous.bind(slideshow));