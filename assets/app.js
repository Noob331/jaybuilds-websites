(()=>{
 const WA='917815883620';
 const menu=document.querySelector('.menu-toggle');
 const nav=document.querySelector('.nav-links');
 if(menu&&nav){menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'✕ Close':'☰ Menu';});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='☰ Menu';}));}
 const current=location.pathname.split('/').pop()||'index.html';
 document.querySelectorAll('.nav-links a').forEach(a=>{if((a.getAttribute('href')||'').split('#')[0]===current)a.setAttribute('aria-current','page');});
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const rev=document.querySelectorAll('.reveal');
 if('IntersectionObserver'in window&&!reduce){const io=new IntersectionObserver(items=>items.forEach(item=>{if(item.isIntersecting){item.target.classList.add('visible');io.unobserve(item.target);}}),{threshold:.10});rev.forEach(el=>io.observe(el));}else rev.forEach(el=>el.classList.add('visible'));
 document.querySelectorAll('[data-wa]').forEach(a=>{const msg=a.getAttribute('data-message')||'Hi JAYBUILDS, I would like to discuss a website project.';a.href='https://wa.me/'+WA+'?text='+encodeURIComponent(msg);a.target='_blank';a.rel='noopener noreferrer';});
 const form=document.querySelector('#project-form');
 if(form){form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const d=new FormData(form);const m=['Hi JAYBUILDS! I would like a website quotation.',`Name: ${d.get('name')}`,`Phone: ${d.get('phone')}`,`Business: ${d.get('business')||'Not provided'}`,`Website type: ${d.get('websiteType')}`,`Budget: ${d.get('budget')||'Not decided'}`,`Timeline: ${d.get('timeline')||'Flexible'}`,`Details: ${d.get('details')||'Please contact me to discuss.'}`].join('\n');const status=document.querySelector('#form-status');if(status){status.textContent='Your enquiry is prepared. WhatsApp will open so you can review and send the message.';status.classList.add('show');}const link='https://wa.me/'+WA+'?text='+encodeURIComponent(m);const win=window.open(link,'_blank','noopener,noreferrer');if(!win)location.href=link;});}

 const calcType=document.querySelector('#calc-type');
 const calcPages=document.querySelector('#calc-pages');
 const calcTotal=document.querySelector('#calc-total');
 const calcSummary=document.querySelector('#calc-summary');
 const calcButton=document.querySelector('#calc-whatsapp');
 const formatINR=n=>'₹'+Math.round(n).toLocaleString('en-IN');
 function updateEstimate(){
   if(!calcType||!calcPages||!calcTotal)return;
   const extras=[...document.querySelectorAll('.calc-extra:checked')];
   const total=Number(calcType.value)+Number(calcPages.value)+extras.reduce((sum,item)=>sum+Number(item.value),0);
   calcTotal.textContent=formatINR(total);
   const typeLabel=calcType.options[calcType.selectedIndex].text.split(' (')[0];
   const pageLabel=calcPages.options[calcPages.selectedIndex].text.split(' (+')[0];
   calcSummary.textContent=typeLabel+' · '+pageLabel+(extras.length?' · '+extras.length+' extra feature'+(extras.length>1?'s':''):'');
   if(calcButton)calcButton.dataset.quote=JSON.stringify({total,typeLabel,pageLabel,extras:extras.map(item=>item.dataset.name)});
 }
 [calcType,calcPages,...document.querySelectorAll('.calc-extra')].forEach(el=>el&&el.addEventListener('change',updateEstimate));
 updateEstimate();
 if(calcButton)calcButton.addEventListener('click',()=>{
   const q=JSON.parse(calcButton.dataset.quote||'{}');
   const message=['Hi JAYBUILDS! I used the website cost calculator and would like a quote.','Website type: '+(q.typeLabel||'Not selected'),'Pages: '+(q.pageLabel||'Not selected'),'Extra features: '+(q.extras&&q.extras.length?q.extras.join(', '):'None selected'),'Estimated starting price: '+formatINR(q.total||0),'Please confirm the final scope and price.'].join('\n');
   window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(message),'_blank','noopener,noreferrer');
 });
 document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
})();