const API_URL = "http://localhost:8080/patrimonios";

        async function listar() {
            const response = await fetch(API_URL);
            const dados = await response.json();
            const tbody = document.getElementById('corpoTabela');
            tbody.innerHTML = dados.map(p => `
                <tr>
                    <td>${p.name}
                    <td>${p.marca}
                    <td>${p.numeroEtiqueta}
                    <td><button onclick="excluir('${p.idPatrimonio}')" style="background: red;">Excluir</button>
                    <button onclick="carregarParaEditar('${p.idPatrimonio}')" style="background: green;">Atualizar</button>
                    
                </tr>
            `).join('');
        }

        async function salvar() {
    const idExistente = document.getElementById('idEdicao').value;
    
    const item = {
        name: document.getElementById('nome').value,
        marca: document.getElementById('marca').value,
        numeroEtiqueta: document.getElementById('etiqueta').value
    };

    let url = API_URL;
    let metodo = 'POST';

    // Se existir um ID no campo escondido, mudamos para PUT e apontamos para o ID certo
    if (idExistente) {
        url = `${API_URL}/${idExistente}`;
        metodo = 'PUT';
    }

    await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
    });

    alert(idExistente ? "Atualizado com sucesso!" : "Salvo com sucesso!");
    
    // Limpa tudo após terminar
    document.getElementById('idEdicao').value = "";
    document.getElementById('nome').value = "";
    document.getElementById('marca').value = "";
    document.getElementById('etiqueta').value = "";
    document.querySelector("button").innerText = "Salvar"; // Volta o texto original
    
    listar();
}

        async function atualizar(id) {
            const itemAtualizado = {
                name: document.getElementById('nome').value,
                marca: document.getElementById('marca').value,
                numeroEtiqueta: document.getElementById('etiqueta').value
            };
            if (confirm("Tem certeza que deseja atualizar este patrimônio?")) {
                await fetch(`${API_URL}/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(itemAtualizado)
                });
                if (response.ok) {
                    alert("Atualizado com sucesso");
                    listar();
                } else {
                    alert("Erro ao atualizar patrimônio. Verifique os dados.")
                }
            }
        }
        listar();

        async function carregarParaEditar(id) {
    // 1. Busca o patrimônio específico pelo ID no seu Backend
    const response = await fetch(`${API_URL}/${id}`);
    const p = await response.json();

    // 2. Preenche os campos de input com os dados que vieram do banco
    document.getElementById('nome').value = p.name;
    document.getElementById('marca').value = p.marca;
    document.getElementById('etiqueta').value = p.numeroEtiqueta;
    
    // 3. Guarda o ID no campo escondido para usarmos no momento de salvar
    document.getElementById('idEdicao').value = id;

    // 4. Muda o texto do botão de "Salvar" para "Confirmar Alteração" para guiar o usuário
    document.querySelector("button[onclick='salvar()']").innerText = "Confirmar Alteração";
}

        async function excluir(id) {
            if (confirm("Tem certeza que deseja excluir este patrimônio?")) {
                await fetch(`${API_URL}/${id}`, {
                    method: 'DELETE'
                });
                alert("Excluído com sucesso!");
                listar();
            }
        }
        listar();