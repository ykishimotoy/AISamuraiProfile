/**
 * シンバイ教授シリーズ 特設ページ
 *
 * 作品データは下の `volumes` 一箇所だけで定義し、
 * Hero・各巻紹介・科学と物語・Start Reading のすべてがこれを参照する。
 * タイトル・キャッチコピー・話数・URLはカクヨム掲載情報が正。変更はここだけで行う。
 */
(function () {
  'use strict';

  const volumes = [
    {
      number: 1,
      title: 'シンバイ教授と人工知能 〜一万回目のさよなら〜',
      shortTitle: '一万回目のさよなら',
      theme: '人工知能',
      tagline: '🔍「犯人は人間じゃない」👩「…量子AI、あなたなの？」',
      episodes: 67,
      url: 'https://kakuyomu.jp/works/2912051603766457614',
      color: '#7fb0ff',
      motif: 'ai',
      synopsis: [
        '生命を創る男、知能を造る男、心を得た機械。その真ん中にいた、平凡な私。',
        '理学部七〇六号室で出会った量子AI・アリス。彼女との友情は、やがて大学を揺るがす事件へとつながっていく。'
      ],
      tags: ['量子AI', '合成生物学', '友情と別れ'],
      scienceQ: '人工知能は心を持てるか',
      humanQ: '心を持った存在を、人はどう愛するのか'
    },
    {
      number: 2,
      title: 'シンバイ教授と時間泥棒 〜重ね合わせの庭〜',
      shortTitle: '重ね合わせの庭',
      theme: '時間',
      tagline: '僕は、姉さんをこの世界に留めたいと思ったんだ。',
      episodes: 101,
      url: 'https://kakuyomu.jp/works/11054822662976085457',
      color: '#86d3a4',
      motif: 'clock',
      synopsis: [
        '余命を宣告された姉を救うため、天才物理学者は時間を止めようとした。',
        '時計の針が動かない庭で、姉弟は何を失い、何を見つけるのか。'
      ],
      tags: ['量子物理学', '時間', '姉弟の愛'],
      scienceQ: '時間を止めることはできるか',
      humanQ: '大切な人と過ごす時間の価値は何で決まるのか'
    },
    {
      number: 3,
      title: 'シンバイ教授と悪性腫瘍 〜生きるという証明〜',
      shortTitle: '生きるという証明',
      theme: '生命',
      tagline: '「君を救う方法なら、ある」——天才教授は、自分の命を実験台にした。',
      episodes: 101,
      url: 'https://kakuyomu.jp/works/11054822666996423705',
      color: '#f08a8c',
      motif: 'cell',
      synopsis: [
        'かつて愛した女性を救うため、シンバイ教授が選んだのは、あまりにも危険な実験だった。',
        '万能に見えた天才科学者が直面する、科学でも思い通りにならない現実。'
      ],
      tags: ['癌', '生命科学', '自己犠牲'],
      scienceQ: '生命を制御することはできるか',
      humanQ: '愛する人を救うために、何を犠牲にしていいのか'
    },
    {
      number: 4,
      title: 'シンバイ教授と透明人間 〜十五年越しの挨拶〜',
      shortTitle: '十五年越しの挨拶',
      theme: '存在',
      tagline: '透明人間は、いる。誰にも見えなかった孤独を、科学は見つけられるか。',
      episodes: 101,
      url: 'https://kakuyomu.jp/works/11054822666999057918',
      color: '#66dcd3',
      motif: 'microbe',
      synopsis: [
        '合成生物学の国際大会・iGEM。世界を舞台にした学生たちの挑戦と、その裏で起こる奇妙な事件。',
        '光を生み出す細菌が照らし出すのは、誰にも見えていなかった一人の研究者だった。'
      ],
      tags: ['iGEM', '合成生物学', '存在と認識'],
      scienceQ: '生物を光らせることはできるか',
      humanQ: '人は、見えているはずの誰かをなぜ見失うのか'
    },
    {
      number: 5,
      title: 'シンバイ教授と夢遊病者 〜まだ、論文がない〜',
      shortTitle: 'まだ、論文がない',
      theme: '心',
      tagline: '「恋は、罪悪ですよ」 天才物理学者は、恋を消す薬を作りはじめた。',
      episodes: 89,
      url: 'https://kakuyomu.jp/works/11054822667002022571',
      color: '#bda4f5',
      motif: 'dawn',
      synopsis: [
        '恋を病気だと思い込んだ天才物理学者と、本当の病によって心を失っていく女性。',
        '科学は人の心を救えるのか。五つの物語が、一つの結末へとつながっていく。'
      ],
      tags: ['恋愛', '精神医学', '回復と希望'],
      scienceQ: '人間の感情を薬で変えられるか',
      humanQ: '科学で説明できない愛を、どう受け止めるのか',
      readingNote: '第1〜4巻を読んでから本作を読むことを強くおすすめします。',
      shortNote: '第1〜4巻の読了後がおすすめ',
      caution: '本作には、うつ病・自殺念慮・自殺未遂に関する描写が含まれます。'
    }
  ];

  // ---------- helpers ----------

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function volLabel(v) {
    return 'VOL. ' + String(v.number).padStart(2, '0');
  }

  // 「シンバイ教授と人工知能 〜一万回目のさよなら〜」→ 主題と副題に分けて表示する
  function splitTitle(v) {
    const i = v.title.indexOf(' 〜');
    if (i === -1) return { main: v.title, sub: '' };
    return { main: v.title.slice(0, i), sub: v.title.slice(i + 1) };
  }

  function linkAttrs(v) {
    return 'href="' + esc(v.url) + '" target="_blank" rel="noopener noreferrer" ' +
      'aria-label="第' + v.number + '巻『' + esc(v.title) + '』をカクヨムで読む（新しいタブで開きます）"';
  }

  // ---------- 抽象ビジュアル（正式な書影ではなく、各巻のモチーフを表す装飾） ----------

  let uid = 0;

  const motifs = {
    // 第1巻：AIの光
    ai: function (id) {
      let s = '';
      [112, 78, 46].forEach(function (r, i) {
        s += '<circle cx="150" cy="172" r="' + r + '" stroke-opacity="' + (0.22 + i * 0.16) + '"' +
          (i === 0 ? ' stroke-dasharray="2 7"' : '') + '/>';
      });
      for (let k = 0; k < 8; k++) {
        const a = (Math.PI * 2 * k) / 8 + 0.3;
        const r = k % 2 ? 78 : 112;
        const x = (150 + Math.cos(a) * r).toFixed(1);
        const y = (172 + Math.sin(a) * r).toFixed(1);
        s += '<line x1="150" y1="172" x2="' + x + '" y2="' + y + '" stroke-opacity=".28"/>' +
          '<circle cx="' + x + '" cy="' + y + '" r="3.5" fill="currentColor" stroke="none"/>';
      }
      s += '<circle cx="150" cy="172" r="60" fill="url(#' + id + ')" stroke="none"/>' +
        '<circle cx="150" cy="172" r="7" fill="#fff" stroke="none"/>';
      return s;
    },
    // 第2巻：止まった時計と、重なり合う庭
    clock: function (id) {
      let s = '<circle cx="150" cy="160" r="70" fill="url(#' + id + ')" stroke="none"/>' +
        '<circle cx="150" cy="160" r="84"/>' +
        '<circle cx="164" cy="170" r="84" stroke-opacity=".35" stroke-dasharray="3 6"/>';
      for (let k = 0; k < 12; k++) {
        const a = (Math.PI * 2 * k) / 12;
        const r1 = k % 3 === 0 ? 68 : 75;
        s += '<line x1="' + (150 + Math.cos(a) * r1).toFixed(1) + '" y1="' + (160 + Math.sin(a) * r1).toFixed(1) +
          '" x2="' + (150 + Math.cos(a) * 80).toFixed(1) + '" y2="' + (160 + Math.sin(a) * 80).toFixed(1) + '" stroke-opacity=".7"/>';
      }
      s += '<line x1="150" y1="160" x2="118" y2="132" stroke-width="2.4"/>' +
        '<line x1="150" y1="160" x2="190" y2="124" stroke-width="1.6"/>' +
        '<circle cx="150" cy="160" r="4" fill="currentColor" stroke="none"/>';
      [[70, 26], [112, -18], [150, 12], [192, -22], [232, 20]].forEach(function (p, i) {
        const top = 318 - (i % 2) * 22;
        s += '<path d="M' + p[0] + ' 400 Q' + (p[0] + p[1]) + ' ' + (top + 40) + ' ' + p[0] + ' ' + top + '" stroke-opacity=".6"/>' +
          '<ellipse cx="' + (p[0] + 9) + '" cy="' + (top + 26) + '" rx="10" ry="4.5" transform="rotate(-35 ' + (p[0] + 9) + ' ' + (top + 26) + ')" stroke-opacity=".6"/>' +
          '<ellipse cx="' + (p[0] - 9) + '" cy="' + (top + 48) + '" rx="10" ry="4.5" transform="rotate(35 ' + (p[0] - 9) + ' ' + (top + 48) + ')" stroke-opacity=".6"/>';
      });
      return s;
    },
    // 第3巻：細胞
    cell: function (id) {
      let s = '';
      [[150, 165, 58], [84, 118, 34], [222, 112, 30], [70, 214, 28], [228, 222, 38], [150, 278, 30], [118, 62, 20], [196, 300, 18]]
        .forEach(function (c, i) {
          s += (i === 0 ? '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + c[2] + '" fill="url(#' + id + ')" stroke="none"/>' : '') +
            '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + c[2] + '" stroke-opacity="' + (i === 0 ? 1 : 0.55) + '"/>' +
            '<circle cx="' + (c[0] + c[2] * 0.18).toFixed(1) + '" cy="' + (c[1] - c[2] * 0.12).toFixed(1) + '" r="' + (c[2] * 0.3).toFixed(1) +
            '" fill="currentColor" fill-opacity="' + (i === 0 ? 0.75 : 0.3) + '" stroke="none"/>';
        });
      return s;
    },
    // 第4巻：発光する微生物
    microbe: function (id) {
      let s = '<circle cx="150" cy="180" r="120" fill="url(#' + id + ')" stroke="none"/>';
      [[150, 170, 20, 1], [92, 110, -35, .6], [214, 122, 62, .7], [76, 222, 80, .5], [224, 236, -18, .8],
        [140, 286, 40, .55], [176, 72, -70, .45], [108, 172, 10, .35], [250, 176, 30, .4], [52, 150, -55, .35]]
        .forEach(function (m) {
          const t = ' transform="rotate(' + m[2] + ' ' + m[0] + ' ' + m[1] + ')"';
          const r = '<rect x="' + (m[0] - 21) + '" y="' + (m[1] - 8) + '" width="42" height="16" rx="8"' + t;
          s += r + ' stroke-width="9" stroke-opacity="' + (m[3] * 0.14).toFixed(2) + '"/>' +
            r + ' fill="currentColor" fill-opacity="' + (m[3] * 0.3).toFixed(2) + '" stroke-opacity="' + m[3] + '"/>';
        });
      return s;
    },
    // 第5巻：夜明けと温かい光
    dawn: function (id) {
      let s = '<circle cx="150" cy="250" r="150" fill="url(#' + id + ')" stroke="none"/>' +
        '<path d="M92 250 A58 58 0 0 1 208 250" stroke="#f6cf96" fill="#f6cf96" fill-opacity=".22" stroke-width="1.6"/>';
      for (let k = 1; k < 8; k++) {
        const a = Math.PI + (Math.PI * k) / 8;
        s += '<line x1="' + (150 + Math.cos(a) * 74).toFixed(1) + '" y1="' + (250 + Math.sin(a) * 74).toFixed(1) +
          '" x2="' + (150 + Math.cos(a) * (k % 2 ? 100 : 122)).toFixed(1) + '" y2="' + (250 + Math.sin(a) * (k % 2 ? 100 : 122)).toFixed(1) +
          '" stroke="#f6cf96" stroke-opacity=".55"/>';
      }
      s += '<line x1="24" y1="250" x2="276" y2="250"/>';
      [[60, 270, 180], [84, 290, 132], [104, 310, 92], [122, 330, 56]].forEach(function (l, i) {
        s += '<line x1="' + l[0] + '" y1="' + l[1] + '" x2="' + (l[0] + l[2]) + '" y2="' + l[1] + '" stroke-opacity="' + (0.5 - i * 0.1) + '"/>';
      });
      return s;
    }
  };

  function cover(v) {
    const id = 'glow-' + (++uid);
    const glow = v.motif === 'dawn' ? '#f6cf96' : v.color;
    return '<div class="cover" style="--c:' + v.color + '" aria-hidden="true">' +
      '<svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" focusable="false">' +
      '<defs><radialGradient id="' + id + '"><stop offset="0" stop-color="' + glow + '" stop-opacity=".5"/>' +
      '<stop offset="1" stop-color="' + glow + '" stop-opacity="0"/></radialGradient></defs>' +
      '<g fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">' + motifs[v.motif](id) + '</g></svg>' +
      '<span class="cover-vol">' + volLabel(v) + '</span>' +
      '<span class="cover-theme">' + esc(v.theme) + '</span>' +
      '</div>';
  }

  // ---------- renderers ----------

  function heroLink(v) {
    const t = splitTitle(v);
    return '<li><a class="vol-link' + (v.number === 1 ? ' vol-link--first' : '') + '" style="--c:' + v.color + '" ' + linkAttrs(v) + '>' +
      '<span class="vol-link-head"><span class="vol-link-num">' + volLabel(v) + '</span>' +
      (v.number === 1 ? '<span class="vol-link-badge">まずはここから</span>' : '<span class="vol-link-theme">' + esc(v.theme) + '</span>') + '</span>' +
      '<span class="vol-link-title">' + esc(t.main) + '</span>' +
      '<span class="vol-link-sub">' + esc(t.sub) + '</span>' +
      '<span class="vol-link-go">カクヨムで読む <span aria-hidden="true">↗</span></span>' +
      '</a></li>';
  }

  function story(v) {
    const t = splitTitle(v);
    return '<article class="story reveal" id="vol-' + v.number + '" style="--c:' + v.color + '">' +
      '<div class="story-cover">' + cover(v) + '</div>' +
      '<div class="story-body">' +
      '<p class="story-num">' + volLabel(v) + '<span>' + esc(v.theme) + '</span></p>' +
      '<h3 class="story-title">' + esc(t.main) + '<span>' + esc(t.sub) + '</span></h3>' +
      '<p class="story-tagline">' + esc(v.tagline) + '</p>' +
      v.synopsis.map(function (p) { return '<p class="story-text">' + esc(p) + '</p>'; }).join('') +
      '<ul class="story-tags">' + v.tags.map(function (g) { return '<li>' + esc(g) + '</li>'; }).join('') + '</ul>' +
      (v.readingNote ? '<p class="story-note">※ ' + esc(v.readingNote) + '</p>' : '') +
      (v.caution ? '<p class="story-caution">' + esc(v.caution) + '</p>' : '') +
      '<div class="story-foot">' +
      '<a class="btn-read" ' + linkAttrs(v) + '>カクヨムで読む <span aria-hidden="true">↗</span></a>' +
      '<span class="story-episodes">完結済・全' + v.episodes + '話</span>' +
      '</div></div></article>';
  }

  function question(v) {
    return '<li class="question reveal" style="--c:' + v.color + '">' +
      '<p class="question-vol">' + volLabel(v) + '<span>' + esc(v.theme) + '</span></p>' +
      '<div class="question-pair">' +
      '<p class="question-science"><span>科学の問い</span>' + esc(v.scienceQ) + '</p>' +
      '<p class="question-human"><span>人間の問い</span>' + esc(v.humanQ) + '</p>' +
      '</div></li>';
  }

  function readCard(v) {
    const t = splitTitle(v);
    return '<li><a class="read-card" style="--c:' + v.color + '" ' + linkAttrs(v) + '>' +
      cover(v) +
      '<span class="read-card-body">' +
      '<span class="read-card-title">' + esc(t.main) + '</span>' +
      '<span class="read-card-sub">' + esc(t.sub) + '</span>' +
      '<span class="read-card-tagline">' + esc(v.tagline) + '</span>' +
      (v.shortNote ? '<span class="read-card-note">※ ' + esc(v.shortNote) + '</span>' : '') +
      '<span class="read-card-go">完結済・全' + v.episodes + '話　読む <span aria-hidden="true">↗</span></span>' +
      '</span></a></li>';
  }

  function render(id, fn) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = volumes.map(fn).join('');
  }

  render('hero-volumes', heroLink);
  render('story-list', story);
  render('question-list', question);
  render('read-volumes', readCard);

  // ---------- nav (mobile menu) ----------

  const header = document.querySelector('.site-header');
  const toggle = document.getElementById('nav-toggle');
  if (header && toggle) {
    const setOpen = function (open) {
      header.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    toggle.addEventListener('click', function () {
      setOpen(!header.classList.contains('nav-open'));
    });
    header.querySelectorAll('.site-nav a').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('nav-open')) {
        setOpen(false);
        toggle.focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.site-header')) setOpen(false);
    });
  }

  // ---------- scroll reveal ----------

  const targets = document.querySelectorAll('.reveal');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    targets.forEach(function (el) { io.observe(el); });
  }
})();
