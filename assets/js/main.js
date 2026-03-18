
(function(){
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if(toggle && nav){
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  const active = nav?.getAttribute('data-active');
  if(active){
    const link = nav.querySelector(`[data-id="${active}"]`);
    if(link) link.classList.add('active');
  }
})();
