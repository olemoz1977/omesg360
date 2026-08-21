(function(){
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');

  // Leadership 360 is a professional OMESG360 product and should be
  // reachable from every public page, not only from the Services page.
  if(nav && !nav.querySelector('[data-id="leadership360"]')){
    const link = document.createElement('a');
    link.href = '/omesg360/leadership-360/';
    link.dataset.id = 'leadership360';
    link.textContent = 'Leadership 360°';
    const services = nav.querySelector('[data-id="services"]');
    if(services) services.insertAdjacentElement('afterend', link);
    else nav.appendChild(link);
  }

  if(toggle && nav){
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  const isLeadership360 = /\/leadership-360\/?(?:index\.html)?$/.test(location.pathname);
  const active = isLeadership360 ? 'leadership360' : nav?.getAttribute('data-active');
  if(active && nav){
    nav.querySelectorAll('a.active').forEach(a => a.classList.remove('active'));
    const link = nav.querySelector(`[data-id="${active}"]`);
    if(link) link.classList.add('active');
  }

  // Give the product a direct entry point on the OMESG360 home page as well.
  if(nav?.getAttribute('data-active') === 'home'){
    const actions = document.querySelector('.hero-actions');
    if(actions && !actions.querySelector('[data-l360-entry]')){
      const link = document.createElement('a');
      link.className = 'btn secondary';
      link.href = '/omesg360/leadership-360/';
      link.dataset.l360Entry = '1';
      link.textContent = 'Leadership 360°';
      actions.appendChild(link);
    }
  }
})();
