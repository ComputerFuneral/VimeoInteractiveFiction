
AFRAME.registerComponent('play-on-window-click', {
  init: function () {
    this.onClick = this.onClick.bind(this);
  },

  play: function () {
    window.addEventListener('click', this.onClick);
    console.log("play")
  },

  pause: function () {
    window.removeEventListener('click', this.onClick);
    console.log("pause")
  },

  onClick: function (evt) {
    console.log("onClick")
    var video = this.el.components.material.material.map.image;
    if (!video) { return; }
    video.play();
  }
});