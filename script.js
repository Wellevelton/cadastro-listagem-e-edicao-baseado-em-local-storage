// Função para cadastrar produto
function cadastrarProduto() {
    const nome = document.getElementById('nome').value;
    const preco = parseFloat(document.getElementById('preco').value);
    const categoria = document.getElementById('categoria').value;

    if (!nome || isNaN(preco) || !categoria) return;

    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const novoProduto = {
        id: produtos.length ? produtos[produtos.length - 1].id + 1 : 1, // ID sequencial
        nome,
        preco,
        categoria
    };
    produtos.push(novoProduto);
    localStorage.setItem('produtos', JSON.stringify(produtos));

    // Mensagem de sucesso
    document.getElementById('mensagemCadastro').innerText = "Produto cadastrado com sucesso!";
    document.getElementById('mensagemCadastro').classList.remove('hidden');

    setTimeout(() => {
        document.getElementById('mensagemCadastro').classList.add('hidden');
    }, 3000); // Timer de 3 segundos

    // Limpa o formulário
    document.getElementById('formProduto').reset();
}

// Função para listar produtos a partir do localStorage
function listarProdutos() {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const tbody = document.getElementById('listaProdutos');
    tbody.innerHTML = ''; // Limpa a lista existente

    // Ordena produtos por ID antes de exibir
    produtos.sort((a, b) => a.id - b.id);

    produtos.forEach(produto => {
        const row = `<tr>
            <td class="border border-gray-300 px-4 py-2">${produto.id}</td>
            <td class="border border-gray-300 px-4 py-2">${produto.nome}</td>
            <td class="border border-gray-300 px-4 py-2">${produto.categoria}</td>
            <td class="border border-gray-300 px-4 py-2">R$ ${produto.preco.toFixed(2).replace('.', ',')}</td>
        </tr>`;
        tbody.innerHTML += row; // Adiciona a linha ao corpo da tabela
    });
}

// Função para listar produtos filtrados por categoria
function listarProdutosPorCategoria() {
    const filtro = document.getElementById('filtroCategoria').value.trim(); // Remove espaços
    const tbody = document.getElementById('listaProdutos');
    tbody.innerHTML = ''; // Limpa a lista existente

    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    
    const produtosFiltrados = produtos.filter(produto => {
        return filtro === '' || produto.categoria === filtro;
    });

    // Ordena produtos filtrados por ID antes de exibir
    produtosFiltrados.sort((a, b) => a.id - b.id);

    produtosFiltrados.forEach(produto => {
        const row = `<tr>
            <td class="border border-gray-300 px-4 py-2">${produto.id}</td>
            <td class="border border-gray-300 px-4 py-2">${produto.nome}</td>
            <td class="border border-gray-300 px-4 py-2">${produto.categoria}</td>
            <td class="border border-gray-300 px-4 py-2">R$ ${produto.preco.toFixed(2).replace('.', ',')}</td>
        </tr>`;
        tbody.innerHTML += row; // Adiciona a linha ao corpo da tabela
    });
}

// Função para buscar produto por nome exato
function buscarProdutoPorNome() {
    const nomeBusca = document.getElementById('buscarNome').value.toLowerCase();
    const listaProdutos = document.getElementById('listaProdutos');
    listaProdutos.innerHTML = ''; // Limpa a lista

    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const produtosFiltrados = produtos.filter(p => p.nome.toLowerCase().includes(nomeBusca)); // Busca pelo nome

    if (produtosFiltrados.length === 0) {
        document.getElementById('mensagemBusca').innerText = "Produto não encontrado, ou não cadastrado";
        document.getElementById('mensagemBusca').classList.remove('hidden');

        setTimeout(() => {
            document.getElementById('mensagemBusca').classList.add('hidden');
        }, 3000); // Timer de 3 segundos
    } else {
        produtosFiltrados.forEach(produto => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="p-4 border border-cyan-400 rounded-md flex justify-between items-center bg-sky-300">
                    <div>
                        <p><strong>Produto:</strong> ${produto.nome}</p>
                        <p><strong>Valor:</strong> R$ ${produto.preco.toFixed(2)}</p>
                        <p><strong>Categoria:</strong> ${produto.categoria}</p>
                    </div>
                    <div>
                        <button onclick="editarProduto(${produto.id})" class="bg-yellow-500 text-white rounded px-2">Editar</button>
                        <button onclick="excluirProduto(${produto.id})" class="bg-red-600 text-white rounded px-2">Excluir</button>
                    </div>
                </div>
            `;
            listaProdutos.appendChild(li);
        });
    }
}

// Função para editar produto
function editarProduto(id) {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const produto = produtos.find(p => p.id === id);
    if (produto) {
        const novoNome = prompt("Novo nome do produto:", produto.nome);
        const novoPreco = prompt("Novo preço do produto:", produto.preco);
        const novaCategoria = prompt("Nova categoria do produto:", produto.categoria);

        if (novoNome && novoPreco && novaCategoria) {
            produto.nome = novoNome;
            produto.preco = parseFloat(novoPreco);
            produto.categoria = novaCategoria;

            localStorage.setItem('produtos', JSON.stringify(produtos));
            buscarProdutoPorNome(); // Atualiza a lista após editar

            // Exibir mensagem de sucesso ao editar
            document.getElementById('mensagemEdicao').innerText = "Produto modificado com sucesso!";
            document.getElementById('mensagemEdicao').classList.remove('hidden');

            setTimeout(() => {
                document.getElementById('mensagemEdicao').classList.add('hidden');
            }, 3000); // Timer de 3 segundos
        }
    }
}

// Função para excluir produto
function excluirProduto(id) {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const produtosFiltrados = produtos.filter(produto => produto.id !== id);
    localStorage.setItem('produtos', JSON.stringify(produtosFiltrados));

    // Mensagem de sucesso
    document.getElementById('mensagemExclusao').innerText = "Produto excluído com sucesso!";
    document.getElementById('mensagemExclusao').classList.remove('hidden');

    setTimeout(() => {
        document.getElementById('mensagemExclusao').classList.add('hidden');
    }, 3000); // Timer de 3 segundos

    buscarProdutoPorNome(); // Atualiza a lista após exclusão
}

// Função para imprimir a lista de produtos
function imprimirLista() {
    const conteudo = document.getElementById('listaProdutos').innerHTML;
    const novaJanela = window.open('', '_blank');
    novaJanela.document.write(`
        <html>
            <head>
                <title>Imprimir Lista de Produtos</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid #000; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                </style>
            </head>
            <body>
                <h1>Lista de Produtos</h1>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Categoria</th>
                            <th>Preço</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${conteudo}
                    </tbody>
                </table>
            </body>
        </html>
    `);
    novaJanela.document.close();
    novaJanela.print();
}

