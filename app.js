(function(){
  const menu=document.querySelector('.menu-btn');
  const links=document.querySelector('.nav-links');
  if(menu && links){
    menu.addEventListener('click',()=>{ const open=links.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); });
    links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>links.classList.remove('open')));
  }
  const current=document.body.dataset.page;
  document.querySelectorAll('.nav-links a[data-page]').forEach(a=>a.classList.toggle('active',a.dataset.page===current));

  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets=document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.waterfall');
  if(reduce){ targets.forEach(el=>el.classList.add('show')); return; }

  const io=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('show');
        io.unobserve(entry.target);
      }
    });
  },{threshold:.08,rootMargin:'0px 0px -40px 0px'});
  targets.forEach(el=>io.observe(el));

  // Guarantee visibility if an observer is unavailable or a browser blocks it.
  window.addEventListener('load',()=>{
    setTimeout(()=>document.querySelectorAll('.waterfall,.reveal,.reveal-left,.reveal-right').forEach(el=>el.classList.add('show')),3500);
  });
})();