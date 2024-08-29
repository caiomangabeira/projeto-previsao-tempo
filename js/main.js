const botao = document.getElementById('botaobuscar');
const itxtcidade = document.getElementById('itxtcidade');
const sectioncidadefornecida = document.querySelector('.cidadefornecida')
const divcf = document.querySelector('.divcf');

async function obterCoordenadas(cidade) {
    const urlcoor = `https://www.meteoblue.com/en/server/search/query3?query=${cidade}&apikey=pXE7KGPmH1ieW5MU`;

    try {
        const responsecoor = await fetch(urlcoor);

        if (!responsecoor.ok) {
            console.log('Erro de resposta do servidor:', responsecoor.statusText);
            return null;
        }

        const dados = await responsecoor.json();
        console.log('Dados das coordenadas:', dados);

        const resultados = dados.results;

        if (resultados && resultados.length > 0) {
            return resultados[0];
        } else {
            console.log('Nenhum resultado encontrado.');
            return null;
        }
    } catch (err) {
        console.log('Erro na requisição:', err);
        return null;
    }
}

async function obterMeteorologia(coordenadas) {
    if (!coordenadas || !coordenadas.lat || !coordenadas.lon) {
        console.log('Coordenadas não disponíveis ou inválidas.');
        return null;
    }

    const { lat, lon } = coordenadas;
    const url = `https://my.meteoblue.com/packages/basic-day_current?apikey=pXE7KGPmH1ieW5MU&lat=${lat}&lon=${lon}&format=json`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            console.log('Erro de resposta do servidor:', response.statusText);
            return null;
        }

        const data = await response.json();
        console.log('Dados da meteorologia da cidade fornecida:', data);
        return data;

    } catch (err) {
        console.log('Erro na requisição:', err);
        return null;
    }
}

function exibircidadefornecida(dados) {
    if (sectioncidadefornecida) {
        //Alterações que serão feitas quando o usuário clicar no botão
        sectioncidadefornecida.innerHTML = '';
        sectioncidadefornecida.style.cssText = `
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-evenly;
            align-items: center;
            background-color: white;
            background-image: none;
        `;

        //Criação dinâmica da div divcidadetemp
        const divcidadetemp = document.createElement('div');
        sectioncidadefornecida.appendChild(divcidadetemp);

        const titulo = document.createElement('h2');
        const paragrafo1 = document.createElement('p');
        const paragrafo2 = document.createElement('p');
        const paragrafo3 = document.createElement('p');
        const divtemperatura = document.createElement('div');
        divcidadetemp.appendChild(titulo);
        divcidadetemp.appendChild(paragrafo1);
        divcidadetemp.appendChild(paragrafo2);
        divcidadetemp.appendChild(paragrafo3);
        divcidadetemp.appendChild(divtemperatura);

        //Conteúdo da div divcidadetemp
        titulo.innerHTML = `${itxtcidade.value}`;
        paragrafo1.innerHTML = `&#127758; Latitude: ${dados.metadata.latitude}`;
        paragrafo2.innerHTML = `&#127758; Longitude: ${dados.metadata.longitude}`;
        paragrafo3.innerHTML = `&#9201; Fuso-horário: ${dados.metadata.timezone_abbrevation}`;
        divtemperatura.innerHTML = `&#9728;&#65039;${dados.data_current.temperature}°C`;

        //Estilo da div divcidadetemp
        divcidadetemp.style.cssText = `
            width: 500px;
            background-image: url(../images/background-nuvens.jpg);
            padding: 10px;
        `;
        titulo.style.cssText = `
            color: rgba(0, 0, 0, 0.712);
            font-size: 30px;
            padding: 30px;
        `;
        paragrafo1.style.cssText = `
            rgba(0, 0, 0, 0.712);
            font-size: 20px;
            padding: 20px;
        `;
        paragrafo2.style.cssText = `
            rgba(0, 0, 0, 0.712);
            font-size: 20px;
            padding: 20px;
        `;
        paragrafo3.style.cssText = `
            rgba(0, 0, 0, 0.712);
            font-size: 20px;
            padding: 20px;
        `;

        divtemperatura.style.cssText = `
            background-color: rgba(0, 0, 0, 0.712);
            color: rgba(255, 255, 255, 0.616);
            font-size: 40px;
            text-align: center;
            padding: 30px
            border radius: 5px;
        `;

        //Criação dinâmica da div divinfoadd
        const divinfoadd = document.createElement('div');
        sectioncidadefornecida.appendChild(divinfoadd);
        
    } else {
        console.log('Elemento para exibir dados não encontrado.');
    }
}

botao.addEventListener("click", async () => {
    const valorCidade = itxtcidade.value;
    const coordenadas = await obterCoordenadas(valorCidade);

    if (coordenadas) {
        const dados = await obterMeteorologia(coordenadas);
        exibircidadefornecida(dados);
    } else {
        if (sectioncidadefornecida) {
            sectioncidadefornecida.innerHTML = '<p>Não foi possível obter coordenadas para a cidade fornecida.</p>';
        }
    }
});