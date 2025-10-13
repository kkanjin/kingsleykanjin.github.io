function smoothNav() {
    document.querySelectorAll('.nav a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            document.querySelector(a.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
        });
    });
}

function highlightNav() {
    const ids = ['about', 'experience', 'skills', 'projects', 'publications', 'contact'];
    const obs = new IntersectionObserver(entries => {
        entries.forEach(en => {
            const link = document.querySelector('.nav a[href="#' + en.target.id + '"]');
            if (link) link.classList.toggle('active', en.isIntersecting);
        });
    }, { threshold: .6 });
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
}

function rotateBanner() {
    const imgs = document.querySelectorAll('.banner img');
    let i = 0;
    function show() { imgs.forEach((im, idx) => im.classList.toggle('show', idx === i)); i = (i + 1) % imgs.length; }
    show(); setInterval(show, 3500);
}

function listHTML(title, arr) {
    if (!Array.isArray(arr) || !arr.length) return '';
    return `<div><h4>${title}</h4><ul>${arr.map(x => `<li>${x}</li>`).join('')}</ul></div>`;
}

async function loadPanels() {
    const res = await fetch('assets/projects.json');
    const data = await res.json();
    const host = document.getElementById('story-panels');
    host.innerHTML = '';

    data.forEach(p => {
        const el = document.createElement('section');
        el.className = 'panel';

        const methodsList = listHTML('Methods', p.methods);
        const dataList = listHTML('Data Used', p['Data']);
        const keyFindingsList = listHTML('Key Findings', p['Key findings']);

        el.innerHTML = `
      <div class="panel-body">
        <div class="text">
          <h3>${p.title}</h3>
          <div class="subtitle">${p.subtitle || ''}</div>
          <p>${p.description || ''}</p>
          ${methodsList}
          <div class="meta">${dataList}${keyFindingsList}</div>
          ${Array.isArray(p.tools) && p.tools.length ? `<div class="pills" style="margin-top:10px">${p.tools.map(t => `<span class="pill">🛠 ${t}</span>`).join('')}</div>` : ''}
        </div>
        <div class="map">
          <img class="panel-hero" src="${p.hero_image}" alt="${p.title}">
        </div>
      </div>
    `;
        host.appendChild(el);
    });

    const obs = new IntersectionObserver(es => {
        es.forEach(e => e.isIntersecting && e.target.classList.add('visible'));
    }, { threshold: .15 });
    document.querySelectorAll('.panel').forEach(p => obs.observe(p));
}

function rotateHeroSlideshow(){
  const slides = document.querySelectorAll('.hero-slideshow .slides img');
  if(!slides.length) return;
  let index = 0;
  setInterval(() => {
    slides[index].classList.remove('active');
    index = (index + 1) % slides.length;
    slides[index].classList.add('active');
  }, 8000); // change every 4 seconds
}

document.addEventListener('DOMContentLoaded', () => {
    smoothNav(); highlightNav(); rotateBanner(); loadPanels(); rotateHeroSlideshow();
    document.getElementById('year').textContent = new Date().getFullYear();
});




