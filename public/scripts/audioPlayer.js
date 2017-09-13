var audioPlayer = document.getElementById('audioPlayer');

var sound = new Howl({
  src: [audioPlayer.getAttribute('src')],
  html5: true
});

function formatTime(secs) {
  var minutes = Math.floor(secs / 60) || 0;
  var seconds = (secs - minutes * 60) || 0;
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

var progress = document.getElementById('progress');
var timer = document.getElementById('timer');
var knob = document.getElementById('knob');
var seeking = false;

function update() {
  progress.style.width = (sound.seek() / sound.duration()) * 100 + '%';
  if (!seeking) {
    knob.style.left = progress.clientWidth + 3 + 'px';
  }
  timer.textContent = formatTime(Math.round(sound.seek()));
}

setInterval(update, 1000);

var duration = document.getElementById('duration');

sound.on('load', () => {
  duration.textContent = formatTime(Math.round(sound.duration()));
  //sound.play();
  update();
})

var pauseBtn = document.getElementById('pauseBtn');
var playBtn = document.getElementById('playBtn');

pauseBtn.addEventListener('click', (e) => {
  sound.pause();
  pauseBtn.style.display = 'none';
  playBtn.style.display = 'inline-block';
});

playBtn.addEventListener('click', (e) => {
  sound.play();
  playBtn.style.display = 'none';
  pauseBtn.style.display = 'inline-block';
});

var skipForward = document.getElementById('skipForward');

skipForward.addEventListener('click', (e) => {
  if (sound.seek() + 15 > sound.duration()) {
    sound.seek(sound.duration())
  }else {
    sound.seek(sound.seek() + 15);
  }
  update()
});

var skipBackward = document.getElementById('skipBackward');

skipBackward.addEventListener('click', (e) => {
  if (sound.seek() - 15 < 0) {
    sound.seek(0)
  }else {
    sound.seek(sound.seek() - 15);
  }
  update()
});

var emptyBar = document.getElementById('emptyBar');
var seeker = document.getElementById('seeker');
var seekStamp = document.getElementById('seekStamp');
var downArrow = document.getElementById('downArrow');

document.addEventListener('mousemove', (e) => {
  seeker.style.right = window.innerWidth - e.x + 'px';
  seekStamp.innerHTML = formatTime(Math.round((seeker.clientWidth / emptyBar.clientWidth) * sound.duration()));
  var dist = (window.innerWidth - e.x) - (seekStamp.clientWidth / 2);
  if (dist < 0) {
    seekStamp.style.right = '0px';
  }else if (dist > window.innerWidth - seekStamp.clientWidth) {
    seekStamp.style.right = window.innerWidth - seekStamp.clientWidth + 'px';
  }else {
    seekStamp.style.right = (window.innerWidth - e.x) - (seekStamp.clientWidth / 2) + 'px';
  }
  downArrow.style.right = (window.innerWidth - e.x) - (downArrow.clientWidth / 2) + 'px';
  if (seeking) {
    knob.style.left = seeker.clientWidth + 3 + 'px';
  }
});

var seekBarContainer = document.getElementById('seekBarContainer');

seekBarContainer.addEventListener('mouseenter', (e) => {
  seeker.style.display = 'block';
  knob.style.transform = 'scale(1)';
  downArrow.style.display = 'block';
  seekStamp.style.display = 'inline-block';
});

seekBarContainer.addEventListener('mouseleave', (e) => {
  seeker.style.display = 'none';
  knob.style.transform = 'scale(0)';
  seekStamp.style.display = 'none';
  downArrow.style.display = 'none';
});

seekBarContainer.addEventListener('click', (e) => {
  sound.seek((seeker.clientWidth / emptyBar.clientWidth) * sound.duration());
  update();
});

var controls = document.getElementById('controls');

knob.addEventListener('mousedown', (e) => {
  seeker.style.backgroundColor = '#e7891b';
  progress.style.display = 'none';
  controls.style.pointerEvents = 'none';
  seeking = true;
});

document.addEventListener('mouseup', (e) => {
  if (seeking) {
    seeker.style.backgroundColor = '#e8c8ab';
    progress.style.display = 'block';
    controls.style.pointerEvents = 'auto';
    seeking = false;
  }
});
