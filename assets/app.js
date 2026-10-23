(()=>{
 const WA='917815883620';
 const menu=document.querySelector('.menu-toggle');
 const nav=document.querySelector('.nav-links');
 if(menu&&nav){menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'✕ Close':'☰ Menu';});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='☰ Menu';}));}
 const moreButton=document.querySelector('.nav-more-toggle');
 const moreMenu=document.querySelector('.nav-more-menu');
 if(moreButton&&moreMenu){
   moreButton.addEventListener('click',()=>{
     const open=moreMenu.classList.toggle('open');
     moreButton.setAttribute('aria-expanded',String(open));
   });
   document.addEventListener('click',event=>{
     if(!event.target.closest('.nav-more')){
       moreMenu.classList.remove('open');
       moreButton.setAttribute('aria-expanded','false');
     }
   });
 }
 const current=location.pathname.split('/').pop()||'index.html';
 document.querySelectorAll('.nav-links a').forEach(a=>{if((a.getAttribute('href')||'').split('#')[0]===current)a.setAttribute('aria-current','page');});
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const rev=document.querySelectorAll('.reveal');
 if('IntersectionObserver'in window&&!reduce){const io=new IntersectionObserver(items=>items.forEach(item=>{if(item.isIntersecting){item.target.classList.add('visible');io.unobserve(item.target);}}),{threshold:.10});rev.forEach(el=>io.observe(el));}else rev.forEach(el=>el.classList.add('visible'));
 document.querySelectorAll('[data-wa]').forEach(a=>{const msg=a.getAttribute('data-message')||'Hi JAYBUILDS, I would like to discuss a website project.';a.href='https://wa.me/'+WA+'?text='+encodeURIComponent(msg);a.target='_blank';a.rel='noopener noreferrer';});
 const form=document.querySelector('#project-form');
 if(form){form.addEventListener('submit',async e=>{e.preventDefault();if(!form.reportValidity())return;const d=new FormData(form);const m=['Hi JAYBUILDS! I would like a website quotation.',`Name: ${d.get('name')}`,`Phone: ${d.get('phone')}`,`Email: ${d.get('email')||'Not provided'}`,`Business: ${d.get('business')||'Not provided'}`,`Website type: ${d.get('websiteType')}`,`Budget: ${d.get('budget')||'Not decided'}`,`Timeline: ${d.get('timeline')||'Flexible'}`,`Details: ${d.get('details')||'Please contact me to discuss.'}`].join('\n');const link='https://wa.me/'+WA+'?text='+encodeURIComponent(m);const win=window.open(link,'_blank','noopener,noreferrer');const status=document.querySelector('#form-status');if(status){status.textContent='Submitting your enquiry…';status.classList.add('show');}try{if(!window.supabase)throw new Error('Enquiry service is temporarily unavailable.');const db=window.supabase.createClient('https://zggntkfvvswtlplmkwyy.supabase.co','sb_publishable_o8AeXbLKfJrc-mH8nMhwDQ_rpa37hxI');const {error}=await db.from('enquiries').insert({customer_name:String(d.get('name')||'').trim(),phone:String(d.get('phone')||'').trim(),email:String(d.get('email')||'').trim()||null,business_name:String(d.get('business')||'').trim()||null,service_type:String(d.get('websiteType')||'Website development'),budget:String(d.get('budget')||'').trim()||null,message:[String(d.get('details')||'').trim(),'Preferred timeline: '+String(d.get('timeline')||'Flexible')].filter(Boolean).join('\n'),source:'website',status:'new'});if(error)throw error;if(status)status.textContent='Enquiry saved successfully. WhatsApp is open so you can also send us the details.';}catch(err){if(status)status.textContent='WhatsApp is open, but we could not save this enquiry automatically. Please send the WhatsApp message and try again later.';console.error('Enquiry submission failed:',err);}if(!win)location.href=link;});}

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