var seekContainer = document.getElementById('seekContainer');
var container = document.getElementById('container');
var pauseBtn = document.getElementById('pauseBtn');
var playBtn = document.getElementById('playBtn');
var skipForward = document.getElementById('skipForward');
var skipBackward = document.getElementById('skipBackward');
var seekBar = document.getElementById('seek');
var seekBg = document.getElementById('seekBg');
var seeker = document.getElementById('seeker');
var seekStamp = document.getElementById('seekStamp');
var duration = document.getElementById('duration');
var downArrow = document.getElementById('downArrow');
var timer = document.getElementById('timer');
var knob = document.getElementById('knob');
var body = document.getElementsByTagName('body')[0];
var buttons = document.getElementById('buttons');

var seeking = false;

console.log(seekBg.attributes);

var sound = new Howl({
  src: ['https://www.audiosear.ch/media/e1c4e8377ef952b65aa327777af6a206/0/public/audio_file/607461/dchha50_Blueprint_for_Armageddon_I.mp3'],
  html5: true
});

function formatTime(secs) {
  var minutes = Math.floor(secs / 60) || 0;
  var seconds = (secs - minutes * 60) || 0;

  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

function update() {
  seekBar.style.width = (sound.seek() / sound.duration()) * 100 + '%';
  if (!seeking) {
    knob.style.left = seekBar.clientWidth + 3 + 'px';
  }
  timer.textContent = formatTime(Math.round(sound.seek()));
}

var seekInterval = setInterval(update, 1000);

sound.on('play', () => {
  console.log('playing');
});

sound.on('pause', () => {
  console.log('paused');
});

sound.on('load', () => {
  duration.textContent = formatTime(Math.round(sound.duration()));
  sound.play();
  update();
})

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

skipForward.addEventListener('click', (e) => {
  if (sound.seek() + 15 > sound.duration()) {
    sound.seek(sound.duration())
  }else {
    sound.seek(sound.seek() + 15);
  }
  update()
});

skipBackward.addEventListener('click', (e) => {
  if (sound.seek() - 15 < 0) {
    sound.seek(0)
  }else {
    sound.seek(sound.seek() - 15);
  }
  update()
});


document.addEventListener('mousemove', (e) => {
  seeker.style.right = window.innerWidth - e.x + 'px';
  seekStamp.innerHTML = formatTime(Math.round((seeker.clientWidth / seekBg.clientWidth) * sound.duration()));
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

seekContainer.addEventListener('mouseenter', (e) => {
  seeker.style.display = 'block';
  knob.style.transform = 'scale(1)';
  downArrow.style.display = 'block';
  seekStamp.style.display = 'inline-block';
});

seekContainer.addEventListener('mouseleave', (e) => {
  seeker.style.display = 'none';
  knob.style.transform = 'scale(0)';
  seekStamp.style.display = 'none';
  downArrow.style.display = 'none';
});

seekContainer.addEventListener('click', (e) => {
  sound.seek((seeker.clientWidth / seekBg.clientWidth) * sound.duration());
  update();
});

knob.addEventListener('mousedown', (e) => {
  seeker.style.backgroundColor = '#e7891b';
  seekBar.style.display = 'none';
  buttons.style.pointerEvents = 'none';
  seeking = true;
});

document.addEventListener('mouseup', (e) => {
  if (seeking) {
    seeker.style.backgroundColor = '#e8c8ab';
    seekBar.style.display = 'block';
    buttons.style.pointerEvents = 'auto';
    seeking = false;
  }
});
