(function () {
  'use strict';

  var KINA_DATE = new Date('2026-10-02T20:00:00+03:00');
  var MUSIC_START = 58;

  /* Hediye bilgileri — buradan güncelleyin */
  var GIFT = {
    name: 'Naz & Yakup',
    iban: 'TR00 0000 0000 0000 0000 0000 00'
  };

  var intro = document.getElementById('intro');
  var invite = document.getElementById('invite');
  var musicBtn = document.getElementById('music-btn');
  var audio = document.getElementById('music-audio');
  var canvas = document.getElementById('particles');
  var ctx = canvas.getContext('2d');
  var isPlaying = false;
  var opened = false;
  var particles = [];
  var animating = false;
  var ambientMode = false;

  /* ---- Canvas boyutlandır ---- */
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  /* ---- Parçacık sistemi ---- */
  var COLORS = ['#C9A84C', '#c99595', '#722F37', '#E8D5A3', '#8fbc8f', '#d4af37'];

  function createParticle(x, y, burst) {
    var types = ['confetti', 'heart', 'leaf'];
    var type = types[Math.floor(Math.random() * types.length)];
    return {
      x: x,
      y: y,
      type: type,
      vx: (Math.random() - 0.5) * (burst ? 14 : 2),
      vy: burst ? -(Math.random() * 12 + 4) : Math.random() * 1.5 + 0.5,
      size: Math.random() * 8 + 6,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      opacity: 1,
      life: burst ? 1 : Math.random(),
      decay: burst ? 0.008 + Math.random() * 0.008 : 0.001 + Math.random() * 0.002,
      gravity: burst ? 0.18 : 0.02,
      wobble: Math.random() * Math.PI * 2,
    };
  }

  function burstParticles(count) {
    var cx = window.innerWidth / 2;
    var cy = window.innerHeight / 2;
    for (var i = 0; i < count; i++) {
      particles.push(createParticle(cx, cy, true));
    }
    if (!animating) {
      animating = true;
      requestAnimationFrame(tick);
    }
  }

  function startAmbient() {
    ambientMode = true;
    canvas.classList.add('ambient');
    if (!animating) {
      animating = true;
      requestAnimationFrame(tick);
    }
  }

  function drawHeart(x, y, size, color, rot) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rot * Math.PI) / 180);
    ctx.fillStyle = color;
    ctx.beginPath();
    var s = size * 0.4;
    ctx.moveTo(0, s * 0.3);
    ctx.bezierCurveTo(0, 0, -s, 0, -s, s * 0.3);
    ctx.bezierCurveTo(-s, s * 0.7, 0, s, 0, s * 1.2);
    ctx.bezierCurveTo(0, s, s, s * 0.7, s, s * 0.3);
    ctx.bezierCurveTo(s, 0, 0, 0, 0, s * 0.3);
    ctx.fill();
    ctx.restore();
  }

  function drawLeaf(x, y, size, color, rot) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rot * Math.PI) / 180);
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.25, size * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.5);
    ctx.lineTo(0, size * 0.5);
    ctx.stroke();
    ctx.restore();
  }

  function drawConfetti(x, y, size, color, rot) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rot * Math.PI) / 180);
    ctx.fillStyle = color;
    ctx.fillRect(-size * 0.3, -size * 0.15, size * 0.6, size * 0.3);
    ctx.restore();
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (ambientMode && particles.length < 35 && Math.random() < 0.08) {
      particles.push(createParticle(Math.random() * canvas.width, -20, false));
    }

    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.wobble += 0.04;
      p.x += p.vx + Math.sin(p.wobble) * 0.3;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotSpeed;
      p.life -= p.decay;
      p.opacity = Math.max(0, p.life);

      if (p.opacity <= 0 || p.y > canvas.height + 40) {
        particles.splice(i, 1);
        continue;
      }

      ctx.globalAlpha = p.opacity;

      if (p.type === 'heart') drawHeart(p.x, p.y, p.size, p.color, p.rotation);
      else if (p.type === 'leaf') drawLeaf(p.x, p.y, p.size, p.color, p.rotation);
      else drawConfetti(p.x, p.y, p.size, p.color, p.rotation);
    }

    ctx.globalAlpha = 1;

    if (particles.length > 0 || ambientMode) {
      requestAnimationFrame(tick);
    } else {
      animating = false;
    }
  }

  /* ---- Davetiyeyi aç ---- */
  function openInvite() {
    if (opened) return;
    opened = true;

    intro.classList.add('opening');
    burstParticles(120);

    setTimeout(function () {
      burstParticles(60);
    }, 200);

    setTimeout(function () {
      intro.classList.add('hide');
      invite.classList.add('show');
      invite.setAttribute('aria-hidden', 'false');
      musicBtn.hidden = false;
      startAmbient();
      startCountdown();
      initFilmstrip();
      startMusic();
    }, 600);

    setTimeout(function () {
      intro.remove();
    }, 1600);
  }

  intro.addEventListener('click', openInvite);
  intro.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') openInvite();
  });
  intro.setAttribute('tabindex', '0');
  intro.setAttribute('role', 'button');

  /* ---- Geri sayım ---- */
  function startCountdown() {
    var daysEl = document.getElementById('cd-days');
    var hoursEl = document.getElementById('cd-hours');
    var minsEl = document.getElementById('cd-mins');
    var secsEl = document.getElementById('cd-secs');

    function tickCd() {
      var diff = KINA_DATE - Date.now();
      if (diff <= 0) {
        daysEl.textContent = '0';
        hoursEl.textContent = '0';
        minsEl.textContent = '0';
        secsEl.textContent = '0';
        return;
      }
      daysEl.textContent = Math.floor(diff / 86400000);
      hoursEl.textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
      minsEl.textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
      secsEl.textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
    }

    tickCd();
    setInterval(tickCd, 1000);
  }

  /* ---- Film şeridi ---- */
  function initFilmstrip() {
    var scroll = document.getElementById('filmstrip-scroll');
    var track = document.getElementById('filmstrip-track');
    if (!scroll || !track) return;
    var clone = track.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    scroll.appendChild(clone);
  }

  window.addFilmPhoto = function (src, alt) {
    var track = document.getElementById('filmstrip-track');
    if (!track) return;
    var cell = document.createElement('div');
    cell.className = 'film-cell';
    cell.innerHTML = '<img src="' + src + '" alt="' + (alt || '') + '" loading="lazy">';
    track.appendChild(cell);
  };

  /* ---- Hediye bölümü ---- */
  function initGift() {
    var nameEl = document.getElementById('gift-name');
    var ibanEl = document.getElementById('gift-iban');
    var copyBtn = document.getElementById('gift-copy');
    if (!nameEl || !ibanEl || !copyBtn) return;

    nameEl.textContent = GIFT.name;
    ibanEl.textContent = GIFT.iban;

    copyBtn.addEventListener('click', function () {
      var raw = GIFT.iban.replace(/\s/g, '');
      var done = function () {
        copyBtn.textContent = 'Kopyalandı ✓';
        copyBtn.classList.add('copied');
        setTimeout(function () {
          copyBtn.textContent = 'IBAN\'ı Kopyala';
          copyBtn.classList.remove('copied');
        }, 2000);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(raw).then(done).catch(function () {
          fallbackCopy(raw, done);
        });
      } else {
        fallbackCopy(raw, done);
      }
    });
  }

  function fallbackCopy(text, cb) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      cb();
    } catch (e) { /* sessiz */ }
    document.body.removeChild(ta);
  }

  initGift();

  /* ---- Müzik ---- */
  if (audio) {
    audio.addEventListener('ended', function () {
      audio.currentTime = MUSIC_START;
      audio.play();
    });
  }

  function startMusic() {
    if (!audio) return;
    audio.volume = 0.7;
    audio.currentTime = MUSIC_START;
    var playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(function () {
        isPlaying = true;
        musicBtn.classList.add('playing');
      }).catch(function () {
        isPlaying = false;
      });
    }
  }

  musicBtn.addEventListener('click', function () {
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      musicBtn.classList.remove('playing');
    } else {
      audio.play();
      isPlaying = true;
      musicBtn.classList.add('playing');
    }
  });

})();
