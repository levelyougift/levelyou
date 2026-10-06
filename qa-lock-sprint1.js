(function(){
const labels={
es:{btn:'Sprint 1 · vista previa (pago desactivado)',msg:'Vista previa de Sprint 1: el pago está desactivado.',notice:'Modo prueba: no se realizará ningún cargo.'},
ca:{btn:'Sprint 1 · vista prèvia (pagament desactivat)',msg:'Vista prèvia de Sprint 1: el pagament està desactivat.',notice:'Mode prova: no es farà cap càrrec.'},
en:{btn:'Sprint 1 · preview (payment disabled)',msg:'Sprint 1 preview: payment is disabled.',notice:'Test mode: you will not be charged.'}
};
function apply(){
 const x=labels[lang]||labels.es,b=document.querySelector('#interestBtn'),n=document.querySelector('[data-i18n="earlyAccess"]');
 if(b){b.textContent=x.btn;b.onclick=()=>alert(x.msg)}
 if(n)n.textContent=x.notice;
}
const old=changeLanguage;
changeLanguage=function(v){old(v);setTimeout(apply,0)};
apply();
})();