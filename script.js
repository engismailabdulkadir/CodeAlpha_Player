// -- Song list (add your files and metadata here) --
const tracks = [
  {
    name: "Song One",
    artist: "Artist A",
    file: "songs/song1.mp3",
    cover: "covers/cover1.jpg"
  },
  {
    name: "Song Two",
    artist: "Artist B",
    file: "songs/song2.mp3",
    cover: "covers/cover2.jpg"
  },
  // add more objects for additional songs...
];

// -- References to DOM elements --
const audio = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('playpause');
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');
const titleEl = document.querySelector('.track-title');
const artistEl = document.querySelector('.track-artist');
const artEl = document.querySelector('.track-art');
const seekSlider = document.getElementById('seek-slider');
const currTimeEl = document.querySelector('.current-time');
const durTimeEl = document.querySelector('.duration');
const volumeSlider = document.getElementById('volume-slider');
const playlistEl = document.getElementById('playlist');
const autoplayCheckbox = document.getElementById('autoplay');

let currentTrack = 0;
let isPlaying = false;
let updateTimer;

// -- Initialize playlist UI --
tracks.forEach((t, index) => {
  const li = document.createElement('li');
  li.textContent = `${t.name} – ${t.artist}`;
  li.addEventListener('click', () => loadTrack(index));
  playlistEl.appendChild(li);
});

// -- Load a track by index --
function loadTrack(index) {
  clearInterval(updateTimer);
  resetValues();
  currentTrack = index;
  audio.src = tracks[index].file;
  artEl.style.backgroundImage = `url(${tracks[index].cover})`;
  titleEl.textContent = tracks[index].name;
  artistEl.textContent = tracks[index].artist;
  playlistEl.querySelectorAll('li').forEach((li,i) =>
    li.classList.toggle('active', i === index)
  );
  audio.load();
  updateTimer = setInterval(seekUpdate, 500);
}

// -- Reset time and slider --
function resetValues() {
  currTimeEl.textContent = "00:00";
  durTimeEl.textContent = "00:00";
  seekSlider.value = 0;
}

// -- Play or Pause toggle --
function playpauseTrack() {
  if (!isPlaying) playTrack();
  else pauseTrack();
}
function playTrack() {
  audio.play();
  isPlaying = true;
  playPauseBtn.innerHTML = "<span>❚❚</span>";
}
function pauseTrack() {
  audio.pause();
  isPlaying = false;
  playPauseBtn.innerHTML = "<span>►</span>";
}

// -- Next / Previous --
function nextTrack() {
  currentTrack = (currentTrack + 1) % tracks.length;
  loadTrack(currentTrack);
  playTrack();
}
function prevTrack() {
  currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
  loadTrack(currentTrack);
  playTrack();
}

// -- Seek and Volume --
function seekTo() {
  const seekto = audio.duration * (seekSlider.value / 100);
  audio.currentTime = seekto;
}
function setVolume() {
  audio.volume = volumeSlider.value / 100;
}

// -- Update progress bar and time display --
function seekUpdate() {
  if (!isNaN(audio.duration)) {
    const seekPosition = (audio.currentTime / audio.duration) * 100;
    seekSlider.value = seekPosition;
    // current time
    const cMins = Math.floor(audio.currentTime / 60);
    const cSecs = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
    currTimeEl.textContent = `${cMins}:${cSecs}`;
    // duration
    const dMins = Math.floor(audio.duration / 60);
    const dSecs = Math.floor(audio.duration % 60).toString().padStart(2, '0');
    durTimeEl.textContent = `${dMins}:${dSecs}`;
  }
}

// -- Autoplay on end if enabled --
audio.addEventListener('ended', () => {
  if (autoplayCheckbox.checked) nextTrack();
  else pauseTrack();
});

// -- Event listeners --
playPauseBtn.addEventListener('click', playpauseTrack);
nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);
seekSlider.addEventListener('input', seekTo);
volumeSlider.addEventListener('input', setVolume);

// -- Start --
loadTrack(0);
setVolume();  // initialize volume
