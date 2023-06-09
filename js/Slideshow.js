class Slideshow {

    constructor(items, duration) {
        this.items = document.getElementsByClassName(items); // DOM element for slide
        this.diapoNum = 0;
        this.playing = true; // Booleen
        this.duration = duration;
        this.autoplay = this.autoPlay();
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
    
}

const slideshow = new Slideshow("slide", 5000);
// slideshow.autoPlay(5000);

document.getElementById("pauseSlide").addEventListener("click", slideshow.pauseButton.bind(slideshow));