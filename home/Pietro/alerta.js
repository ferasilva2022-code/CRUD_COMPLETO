(() => {
    'use strict';
    const app=window.BusMapAlerts;
    const $=id=>document.getElementById(id);
    const el=app.element;
    const form=$('nt-form'),save=$('nt-save'),feedback=$('nt-feedback');
    let pending=false,linesLoaded=false,linesLoading=false;
    function message(text='',error=false){feedback.textContent=text;feedback.dataset.tipo=error?'erro':'ok';feedback.setAttribute('role',error?'alert':'status');}
    function reset(){form.reset();$('nt-id').value='';$('nt-revisao').value='';$('nt-form-title').textContent='Novo alerta';save.textContent='Cadastrar alerta';$('nt-cancel').hidden=true;}
    function lock(value){pending=value;form.querySelectorAll('button,input,select,textarea').forEach(node=>{node.disabled=value;});$('nt-list').querySelectorAll('button').forEach(node=>{node.disabled=value;});}
    function edit(item){
        if(pending)return;
        $('nt-id').value=item.id;$('nt-revisao').value=item.revisao;
        $('nt-titulo').value=item.titulo;$('nt-descricao').value=item.descricao;
        $('nt-aba').value=item.aba;$('nt-prioridade').value=item.prioridade;
        $('nt-linha').value=item.id_linha||'';$('nt-ativo').checked=Number(item.ativo)===1;
        $('nt-form-title').textContent=`Editar alerta #${item.id}`;save.textContent='Salvar alterações';$('nt-cancel').hidden=false;
        message('Altere os campos e clique em Salvar alterações.');$('nt-titulo').focus();
    }
    function button(label,action,danger=false){const node=el('button',label,'nt-btn'+(danger?' nt-danger':''));node.type='button';node.disabled=pending;node.addEventListener('click',action);return node;}
    function render(){
        if(!app.ready)return;
        const options={aba:$('nt-filtro-aba').value,status:$('nt-filtro-status').value,leitura:$('nt-filtro-leitura').value,busca:$('nt-busca').value};
        const items=app.core.filter(app.alerts,options,app.read);
        const list=$('nt-list');list.replaceChildren();
        $('nt-count').textContent=`${items.length} alerta(s) encontrado(s).`;
        $('nt-read-all').disabled=pending||!app.alerts.some(a=>Number(a.ativo)===1&&!app.core.isRead(a,app.read));
        if(!items.length){list.append(el('li',app.alerts.length?'Nenhum alerta corresponde aos filtros. Ajuste a busca ou os filtros.':'Nenhum alerta cadastrado. Use o formulário para publicar o primeiro aviso.','nt-state'));return;}
        for(const item of items){
            const li=el('li','','nt-item');li.dataset.prioridade=item.prioridade;
            li.append(el('span',app.priorityLabels[item.prioridade],`nt-chip bm-${item.prioridade}`));
            const isRead=app.core.isRead(item,app.read);
            li.append(el('span',Number(item.ativo)===1?(isRead?'Lido':'Não lido'):'Inativo','nt-chip'));
            li.append(el('h3',item.titulo));li.append(el('p',item.descricao));
            const scope=app.labels[item.aba]||item.aba;
            // Datas DATETIME/TIMESTAMP são exibidas como retornadas pelo servidor, sem supor fuso.
            li.append(el('p',`#${item.id} · ${scope}${item.id_linha?' · Linha '+item.id_linha+(item.nome_linha?' — '+item.nome_linha:''):''} · Atualizado: ${item.atualizado_em}`,'nt-meta'));
            const actions=el('div','','nt-actions');
            actions.append(button(isRead?'Marcar como não lido':'Marcar como lido',()=>{const saved=app.mark(item,!isRead);message(saved?(isRead?'Alerta marcado como não lido.':'Alerta marcado como lido.'):'O navegador bloqueou o armazenamento. A leitura vale só nesta página.',!saved);}));
            actions.append(button('Editar',()=>edit(item)));
            actions.append(button('Excluir',()=>remove(item),true));li.append(actions);list.append(li);
        }
    }
    async function loadLines(){
        if(linesLoading||linesLoaded)return;
        linesLoading=true;
        try {
            const rows=await app.request('GET',null,'linhas');
            const select=$('nt-linha');const selected=select.value;
            select.replaceChildren(new Option('Sem vínculo com uma linha',''));
            rows.forEach(row=>select.add(new Option(`${row.id} — ${row.nome}`,row.id)));select.value=selected;
            linesLoaded=true;
        }catch(error){message('Não foi possível carregar as linhas. '+error.message,true);}
        finally{linesLoading=false;}
    }
    async function remove(item){
        if(pending||!window.confirm(`Excluir o alerta “${item.titulo}”? Esta ação remove o registro.`))return;
        lock(true);
        try {
            await app.request('DELETE',{id:Number(item.id),revisao:Number(item.revisao)});
            if($('nt-id').value===String(item.id))reset();
            message('Alerta excluído.');
            try{await app.refresh();}catch(error){message('Alerta excluído, mas a lista não foi atualizada. '+error.message,true);}
        }catch(error){message(error.message,true);}
        finally{lock(false);render();}
    }
    form.addEventListener('submit',async event=>{
        event.preventDefault();if(pending||!app.ready||!form.reportValidity())return;
        const data={titulo:$('nt-titulo').value.trim(),descricao:$('nt-descricao').value.trim(),aba:$('nt-aba').value,id_linha:$('nt-linha').value||null,prioridade:$('nt-prioridade').value,ativo:$('nt-ativo').checked?1:0};
        if(!data.titulo||!data.descricao){message('Preencha o título e a descrição com texto.',true);return;}
        const editing=Boolean($('nt-id').value);
        if(editing){data.id=Number($('nt-id').value);data.revisao=Number($('nt-revisao').value);}
        lock(true);save.textContent='Salvando…';
        try {
            await app.request(editing?'PUT':'POST',data);
            reset();message(editing?'Alerta atualizado. A nova versão aparecerá como não lida.':'Alerta cadastrado.');
            try{await app.refresh();}catch(error){message('O alerta foi salvo, mas a lista não foi atualizada. '+error.message,true);}
        }catch(error){message(error.message,true);save.textContent=editing?'Salvar alterações':'Cadastrar alerta';}
        finally{lock(false);render();}
    });
    $('nt-cancel').addEventListener('click',()=>{reset();message('Edição cancelada.');});
    $('nt-refresh').addEventListener('click',async()=>{
        const btn=$('nt-refresh');btn.disabled=true;
        try{await app.refresh();if(!linesLoaded)await loadLines();}catch(error){message(error.message,true);}
        finally{btn.disabled=false;}
    });
    $('nt-read-all').addEventListener('click',()=>{const saved=app.markAll();message(saved?'Todos os alertas ativos foram marcados como lidos.':'O navegador bloqueou o armazenamento. A leitura vale só nesta página.',!saved);});
    ['nt-busca','nt-filtro-aba','nt-filtro-status','nt-filtro-leitura'].forEach(id=>$(id).addEventListener(id==='nt-busca'?'input':'change',render));
    const tab=new URLSearchParams(location.search).get('aba');if(Object.hasOwn(app.labels,tab)&&tab!=='todos')$('nt-filtro-aba').value=tab;
    document.addEventListener('busmap:alerts',()=>{if(!pending){save.disabled=false;save.textContent=$('nt-id').value?'Salvar alterações':'Cadastrar alerta';}render();loadLines();});
    document.addEventListener('busmap:read',render);
    document.addEventListener('busmap:error',()=>{if(!app.ready){save.textContent='Servidor indisponível';$('nt-count').textContent='Não foi possível carregar os alertas. Confira a mensagem acima e clique em Atualizar lista.';}});
    if(app.ready){save.disabled=false;save.textContent='Cadastrar alerta';render();loadLines();}
})();
