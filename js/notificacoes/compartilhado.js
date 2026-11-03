/* Contador e avisos presentes em todas as abas. Sem dependências externas. */
(() => {
    'use strict';
    const script=document.currentScript;
    const base=new URL('../../',script.src);
    const api=new URL('php/Notificacoes/api.php',base);
    const center=new URL('home/Notificacoes/notificacoes.html',base);
    const core=window.BusMapAlertCore;
    const key='busmap.alertas.lidos.v1:'+base.pathname;
    const labels={todos:'Todas as abas',usuarios:'Usuários',linhas:'Linhas',itinerarios:'Itinerários',pontos:'Pontos',horarios:'Horários'};
    const priorityLabels={info:'Informação',aviso:'Atenção',urgente:'Urgente'};
    let alerts=[],csrf='',busy=false,ready=false,read={};
    try { const value=JSON.parse(localStorage.getItem(key)||'{}'); if(value&&typeof value==='object'&&!Array.isArray(value))read=value; } catch (_) { /* Navegação sem persistência local. */ }
    const emit=name=>document.dispatchEvent(new CustomEvent(name));
    function text(tag,value,className){const el=document.createElement(tag);el.textContent=value;if(className)el.className=className;return el;}
    function notify(message){const el=document.getElementById('bm-notification-status');if(el)el.textContent=message;}
    function persist(){
        let saved=true;
        try {localStorage.setItem(key,JSON.stringify(read));}
        catch(_){saved=false;notify('A leitura vale só nesta página: o navegador não permitiu salvar a preferência.');}
        render();emit('busmap:read');return saved;
    }
    function mark(item,value=true){if(value)read[String(item.id)]=Number(item.revisao);else delete read[String(item.id)];return persist();}
    function markAll(){alerts.filter(a=>Number(a.ativo)===1).forEach(a=>{read[String(a.id)]=Number(a.revisao);});return persist();}
    async function request(method='GET',data=null,resource=''){
        const url=new URL(api);
        if(resource)url.searchParams.set('recurso',resource);
        let response;
        try {response=await fetch(url,{method,credentials:'same-origin',cache:'no-store',headers:method==='GET'?{}:{'Content-Type':'application/json','X-CSRF-Token':csrf},...(data?{body:JSON.stringify(data)}:{})});}
        catch(_){throw new Error('Não foi possível acessar o servidor. Confira o Apache e tente novamente.');}
        let result;
        try {result=await response.json();}catch(_){throw new Error('O servidor não retornou JSON. Abra pelo localhost e confira a instalação do PHP.');}
        if(result.csrf)csrf=result.csrf;
        if(!response.ok||result.status!=='ok')throw new Error(result.mensagem||'Não foi possível concluir a operação.');
        return result.data;
    }
    async function refresh(){
        if(busy)return;
        busy=true;
        try {alerts=await request();ready=true;notify('');render();emit('busmap:alerts');return alerts;}
        catch(error){notify(error.message);emit('busmap:error');throw error;}
        finally{busy=false;}
    }
    function render(){
        const unread=alerts.filter(a=>Number(a.ativo)===1&&!core.isRead(a,read)).length;
        document.querySelectorAll('[data-bm-count]').forEach(el=>{el.textContent=ready?String(unread):'…';el.setAttribute('aria-label',ready?`${unread} notificações não lidas`:'Carregando notificações');});
        const panel=document.getElementById('bm-alertas');
        if(!panel)return;
        panel.replaceChildren();
        const tab=document.body.dataset.aba||'inicio';
        if(tab==='notificacoes')return;
        const relevant=core.forTab(alerts,tab).filter(a=>!core.isRead(a,read));
        for(const item of relevant.slice(0,3)){
            const row=text('article','',`bm-alerta bm-${item.prioridade}`);
            const content=text('div','');
            content.append(text('strong',`${priorityLabels[item.prioridade]}: ${item.titulo}`));
            content.append(text('p',item.descricao));
            if(item.id_linha)content.append(text('small',`Linha ${item.id_linha}`));
            const button=text('button','Marcar como lida','bm-button');button.type='button';
            button.addEventListener('click',()=>mark(item));row.append(content,button);panel.append(row);
        }
        if(relevant.length>3){const link=text('a',`Ver os ${relevant.length} avisos desta aba`);const target=new URL(center);target.searchParams.set('aba',tab);link.href=target;panel.append(link);}
    }
    window.BusMapAlerts={request,refresh,mark,markAll,labels,priorityLabels,core,element:text,get alerts(){return alerts;},get read(){return read;},get ready(){return ready;}};
    window.addEventListener('storage',event=>{if(event.key===key||event.key===null){try{read=JSON.parse(localStorage.getItem(key)||'{}')||{};}catch(_){read={};}render();emit('busmap:read');}});
    function init(){
        const nav=document.querySelector('.navbar-nav');
        if(nav&&!nav.querySelector('[data-bm-link]')){
            const link=text('a','Notificações ','nav-link');link.href=center;link.dataset.bmLink='';
            if(document.body.dataset.aba==='notificacoes')link.setAttribute('aria-current','page');
            const badge=text('span','…','bm-badge');badge.dataset.bmCount='';link.append(badge);nav.append(link);
        }
        const region=text('section','','bm-region');region.setAttribute('aria-label','Avisos da aba');
        const status=text('p','','bm-status');status.id='bm-notification-status';status.setAttribute('role','status');
        const panel=text('div','');panel.id='bm-alertas';region.append(status,panel);
        const header=document.querySelector('header')||document.querySelector('nav');
        if(header)header.after(region);else document.body.prepend(region);
        refresh().catch(()=>{});
        setInterval(()=>{if(!document.hidden)refresh().catch(()=>{});},30000);
        document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh().catch(()=>{});});
    }
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
