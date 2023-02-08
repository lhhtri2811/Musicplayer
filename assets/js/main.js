const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const songName = $(".dashboard header h2");
const cdThumb = $(".cd .cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const playBTN = $(".btn-toggle-play");
const repeatBTN = $(".btn-repeat");
const nextBTN = $(".btn-next");
const prevBTN = $(".btn-prev");
const randomBTN = $(".btn-random");
const player = $(".player");
const progress = $("#progress");

const app = {
  currentSongIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  songs: [
    {
      name: "Invincible",
      singer: "DEAF KEV",
      path: "./assets/songs/Invincible.mp3",
      image: "./assets/images/1.jpg",
    },
    {
      name: "Heart Afire",
      singer: "Defqwop feat Strix",
      path: "./assets/songs/Heartafire.mp3",
      image: "./assets/images/2.jpg",
    },
    {
      name: "My Heart",
      singer: "Different Heaven",
      path: "./assets/songs/Myheart.mp3",
      image: "./assets/images/3.jpg",
    },
    {
      name: "Nekozilla",
      singer: "Different Heaven",
      path: "./assets/songs/Nekozilla.mp3",
      image: "./assets/images/4.jpg",
    },
    {
      name: "Energy",
      singer: "Elektronomia",
      path: "./assets/songs/Energy.mp3",
      image: "./assets/images/5.jpg",
    },
    {
      name: "Sky High",
      singer: "Elektronomia",
      path: "./assets/songs/Skyhigh.mp3",
      image: "./assets/images/6.jpg",
    },
    {
      name: "Lost Sky",
      singer: "Fearless",
      path: "./assets/songs/Lostsky.mp3",
      image: "./assets/images/7.jpg",
    },
  ],
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentSongIndex];
      },
    });
  },
  render: function () {
    const htmls = this.songs.map((song) => {
      return `
            <div class="song">
                <div
                class="thumb"
                style="
                    background-image: url(${song.image});
                "
                ></div>
                <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
        `;
    });
    const playlist = $(".playlist");
    playlist.innerHTML = htmls.join("");
  },
  handleEvent: function () {
    const _this = this;
    //rotate cd
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });
    cdThumbAnimate.pause();
    //scaled cd on scroll playlist
    const cdWidth = cd.offsetWidth;
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCDWidth = cdWidth - scrollTop;
      cd.style.width = newCDWidth > 0 ? newCDWidth + "px" : 0;
      cd.style.opacity = newCDWidth / cdWidth;
    };
    //play - pause
    playBTN.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      audio.onplay = function () {
        _this.isPlaying = true;
        player.classList.add("playing");
        cdThumbAnimate.play();
      };
      audio.onpause = function () {
        _this.isPlaying = false;
        player.classList.remove("playing");
        cdThumbAnimate.pause();
      };
    };
    //progress
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };
    //slide progress
    progress.onchange = function (e) {
      const seek = (e.target.value * audio.duration) / 100;
      audio.currentTime = seek;
    };
    //next song
    nextBTN.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
    };
    //prev song
    prevBTN.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
    };
    //random song
    randomBTN.onclick = function () {
      _this.isRandom = !_this.isRandom;
      randomBTN.classList.toggle("active", _this.isRandom);
    };
  },
  nextSong: function () {
    this.currentSongIndex++;
    if (this.currentSongIndex >= this.songs.length) {
      this.currentSongIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentSongIndex--;
    if (this.currentSongIndex < 0) {
      this.currentSongIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  randomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentSongIndex);
    this.currentSongIndex = newIndex;
    this.loadCurrentSong();
  },
  loadCurrentSong: function () {
    songName.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
    audio.src = this.currentSong.path;
  },
  start: function () {
    this.handleEvent();
    this.defineProperties();
    this.loadCurrentSong();
    this.render();
  },
};

app.start();
