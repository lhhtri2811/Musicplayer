const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playlist = $(".playlist");
const player = $(".player");
const currSongName = $(".dashboard header h2");
const currSongCDThumb = $(".cd-thumb");
const cd = $(".cd");
const audio = $("#audio");
const playBTN = $(".btn-toggle-play");
const nextBTN = $(".btn-next");
const prevBTN = $(".btn-prev");
const randomBTN = $(".btn-random");
const repeatBTN = $(".btn-repeat");
const progress = $("#progress");

const app = {
  currentSongIndex: 0,
  isPlaying: false,
  isRepeat: false,
  isRandom: false,
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
  loadCurrentSong: function () {
    _this = this;
    currSongName.textContent = this.currentSong.name;
    currSongCDThumb.style.backgroundImage = `url(${this.currentSong.image})`;
    audio.src = this.currentSong.path;
    //active current song
    const listSong = $$(".song");
    const currActive = $(".song.active");
    if (currActive) {
      currActive.classList.remove("active");
    }
    listSong[this.currentSongIndex].classList.add("active");
    listSong[this.currentSongIndex].scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "end",
    });
  },
  render: function () {
    let htmls = this.songs.map((song, index) => {
      return `
        <div class="song" data-index=${index}>
            <div
            class="thumb"
            style="
                background-image: url('${song.image}');
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
    playlist.innerHTML = htmls.join("");
  },
  handleEvents: function () {
    const _this = this;
    //scroll playlist event
    const cdWidth = cd.offsetWidth;
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCDWdith = cdWidth - scrollTop;
      cd.style.width = newCDWdith > 0 ? newCDWdith + "px" : 0;
      cd.style.opacity = newCDWdith / cdWidth;
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
    //animation rotate cd
    const cdThumbAnimate = currSongCDThumb.animate(
      [
        {
          transform: "rotate(360deg)",
        },
      ],
      {
        duration: 10000,
        iterations: Infinity,
      }
    );
    cdThumbAnimate.pause();
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
    //repeat
    repeatBTN.onclick = function () {
      repeatBTN.classList.toggle("active");
      _this.isRepeat = !_this.isRepeat;
      if (_this.isRepeat) {
        audio.setAttribute("loop", "");
      } else {
        audio.removeAttribute("loop", "");
      }
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
    //radom song
    randomBTN.onclick = function () {
      _this.isRandom = !this.isRandom;
      randomBTN.classList.toggle("active");
    };
    //choose song from playlist
    playlist.onclick = function (e) {
      if (!e.target.closest(".option")) {
        _this.currentSongIndex = Number(
          e.target.closest(".song").dataset.index
        );
        _this.loadCurrentSong();
        audio.play();
      }
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
  start: function () {
    this.defineProperties();
    this.render();
    this.loadCurrentSong();
    this.handleEvents();
  },
};

app.start();
