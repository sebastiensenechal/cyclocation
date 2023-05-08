// **************************
// **** API HTML5 CANVAS ****
// **************************

var positionX;
var positionY;

var SignCanvas = {
  writing: false, // Activer ou non le tracé
  canvas: document.querySelector('#paint'),
  ctx: null, // Contexte
  mousePosition: null,
  reservation: null,

  // Récupérer la position de la souri et du touch sur le canvas
  getMousePos : function(event) {
    let rect = this.canvas.getBoundingClientRect();
    // Retourne la largeur et la hauteur de canvas avec chiffres derrière virgule.
    // On récupère les propriétés left et top de getBoundingClientRect()
    return {
      x:event.clientX - rect.left, // Horizontal
      y:event.clientY - rect.top // Vertical
    };
  },

  movingMouse: function(event) {
    this.mousePosition = this.getMousePos(event); // On récupère la position de la souris
    this.draw(this.mousePosition.x, this.mousePosition.y);
  },

  draw: function(positionX, positionY) {
    if (this.writing === true) {
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = "#454545";
      this.ctx.lineTo(positionX, positionY); // Désigne le point de départ du tracé
      this.ctx.stroke(); // Ordre d'effectuer le tracé
    }
  },

  disableDrawing: function() {
    this.writing = false;
  },

  activateDrawing: function() {
    this.writing = true;
    this.reservation = true;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.beginPath(); // initialise le nouveau tracé
    this.ctx.moveTo(positionX, positionY); // Effectuer le tracé
  },

  clearCanvas: function() {
    this.reservation = false;
    this.ctx.clearRect(0, 0, 300, 150); // Réinitialise le canvas
  },

  // Traduire mouse en event pour écrans tactiles touch
  initTouch : function(ev) {
      let typeEV;
      let mouseEv;

      let touch = ev.targetTouches[0];
      ev.preventDefault(); // Stop prapagation

      if (ev.type === "touchstart") {
        touch = ev.targetTouches[0];
        typeEV = 'mousedown';

      } else if (ev.type === "touchmove") {
        touch = ev.targetTouches[0];
        typeEV = 'mousemove';

      } else if (ev.type === "touchend") {
        touch = ev.changedTouches[0];
        typeEV = 'mouseup';
      };

      mouseEv = document.createEvent("MouseEvents");
      mouseEv.initMouseEvent(typeEV, // Genre de l'événement
          true,
          true,
          window, // Vue de l'événement
          0, // Compte clique de souris
          touch.screenX,
          touch.screenY,
          touch.clientX,
          touch.clientY,
          ev.ctrlKey, // Vérifie la pression sur touche "CTRL"
          ev.altKey, // Vérifie "ALT"
          ev.shiftKey, // Vérifie "MAJ"
          ev.metaKey, // Vérifie "META"
          0, // Bouton de la souris
          null // Cible
      );

      this.dispatchEvent(mouseEv); // Relance la propagation
  }

}




SignCanvas.canvas.addEventListener("touchstart", SignCanvas.initTouch, {passive: false});
SignCanvas.canvas.addEventListener("touchmove", SignCanvas.initTouch, {passive: true});
SignCanvas.canvas.addEventListener("touchend", SignCanvas.initTouch, {passive: true});

SignCanvas.canvas.addEventListener("mousedown", SignCanvas.activateDrawing.bind(SignCanvas), {passive: true});
SignCanvas.canvas.addEventListener("mousemove", SignCanvas.movingMouse.bind(SignCanvas), {passive: true});
SignCanvas.canvas.addEventListener("mouseup", SignCanvas.disableDrawing.bind(SignCanvas), {passive: true});

document.getElementById("buttonClear").addEventListener("click", function() {
    SignCanvas.clearCanvas();
});
