class Slideshow {

    constructor(items, playing) {
        this.items = document.getElementsByClassName(items); // DOM element for slide
        this.diapoNum = 0;
        this.playing = playing; // Booleen
    }

    autoPlay(timer) {
        this.timer = setInterval(this.next.bind(this), timer);
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
    
}

const slideshow = new Slideshow("slide", true);
slideshow.autoPlay(5000);