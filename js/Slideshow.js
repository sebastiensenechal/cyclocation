class Slideshow {
    
    constructor(slides, duration) {
        this.slides = document.getElementsByClassName(slides); // DOM element for slide
        this.slideIndex = 0;
        this.duration = duration;
        this.playing = true; // Booleen for autoplay
        this.autoplay = this.autoPlay();
        this.keysKeyboard = document.addEventListener("keydown", this.keysKeyboard.bind(this));
    }
    
    autoPlay() {
        this.timer = setInterval(this.next.bind(this), this.duration);
        // Millisecondes par tour, 5 secondes par défaut
        console.log('Autoplay : ' + this.playing);
    } 
    
    next() {
        this.slides[this.slideIndex].style.opacity = "0";
        if (this.slideIndex === this.slides.length -1) {
            this.slideIndex = 0;
        } else {
            this.slideIndex++;
        }
        this.slides[this.slideIndex].style.opacity = "1";
    }
    
    previous() {
        this.slides[this.slideIndex].style.opacity = "0";
        if (this.slideIndex === 0) {
            this.slideIndex = this.slides.length -1;
        } else {
            this.slideIndex--;
        }
        this.slides[this.slideIndex].style.opacity = "1";
    }
    
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
            document.addEventListener("keydown", this.next()); // Right
        } else if (event.keyCode === 37) {
            document.addEventListener("keydown", this.previous()); // Left
        } else if ((event.keyCode === 13) || (event.keyCode === 19) || (event.keyCode === 32)) {
            document.addEventListener("keydown", this.pauseButton()); // Escape, Enter and Pause
        }
    }
    
}

const slideshow = new Slideshow("slide", 5000);

document.getElementById("pauseSlide").addEventListener("click", slideshow.pauseButton.bind(slideshow));
document.getElementById("arrowRight").addEventListener("click", slideshow.next.bind(slideshow));
document.getElementById("arrowLeft").addEventListener("click", slideshow.previous.bind(slideshow));