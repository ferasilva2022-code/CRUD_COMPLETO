/* Regras de exibição compartilhadas e testáveis, sem dependência do DOM. */
(function(root,factory){
    const api=factory();
    if(typeof module==='object'&&module.exports) module.exports=api;
    else root.BusMapAlertCore=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
    const priorities={urgente:0,aviso:1,info:2};
    const sort=items=>[...items].sort((a,b)=>(priorities[a.prioridade]??2)-(priorities[b.prioridade]??2)||Number(b.id)-Number(a.id));
    const isRead=(item,read)=>Number(read[String(item.id)])===Number(item.revisao);
    const forTab=(items,tab)=>sort(items.filter(a=>Number(a.ativo)===1&&(a.aba==='todos'||a.aba===tab)));
    function filter(items,options={},read={}){
        const query=(options.busca||'').trim().toLocaleLowerCase('pt-BR');
        return sort(items.filter(a=>
            (!options.aba||a.aba==='todos'||a.aba===options.aba)&&
            (!options.status||(options.status==='ativos'?Number(a.ativo)===1:Number(a.ativo)===0))&&
            (!options.leitura||options.leitura==='todos'||(options.leitura==='nao-lidos'?!isRead(a,read):isRead(a,read)))&&
            (!query||[a.titulo,a.descricao,a.id_linha].join(' ').toLocaleLowerCase('pt-BR').includes(query))
        ));
    }
    return {sort,isRead,forTab,filter};
});
