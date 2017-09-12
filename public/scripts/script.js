var seekContainer = document.getElementById('seekContainer');
var pauseBtn = document.getElementById('pauseBtn');
var playBtn = document.getElementById('playBtn');
var skipForward = document.getElementById('skipForward');
var skipBackward = document.getElementById('skipBackward');
var seekBar = document.getElementById('seek');
var seekBg = document.getElementById('seekBg');
var seeker = document.getElementById('seeker');
var seekStamp = document.getElementById('seekStamp');
var duration = document.getElementById('duration');
var timer = document.getElementById('timer');

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
  seekStamp.textContent = formatTime(Math.round((seeker.clientWidth / seekBg.clientWidth) * sound.duration()));
  seekStamp.style.right = (window.innerWidth - e.x) - (seekStamp.clientWidth / 2) + 'px';
});

seekContainer.addEventListener('mouseenter', (e) => {
  seeker.style.display = 'block';
  seekStamp.style.display = 'inline-block';
});

seekContainer.addEventListener('mouseleave', (e) => {
  seeker.style.display = 'none';
  seekStamp.style.display = 'none';
});

seekContainer.addEventListener('click', (e) => {
  sound.seek((seeker.clientWidth / seekBg.clientWidth) * sound.duration());
  update();
});
