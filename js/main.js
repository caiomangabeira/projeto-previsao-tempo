const botao = document.getElementById('botaobuscar');
const itxtcidade = document.getElementById('itxtcidade');
const sectioncidadefornecida = document.querySelector('.cidadefornecida');
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
        divtemperatura.innerHTML = `&#9925;&#65039;${dados.data_current.temperature}°C`;

        //Estilo da div divcidadetemp
        divcidadetemp.style.cssText = `
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
            width: 100%;
            color: rgba(0, 0, 0, 0.712);
            font-size: 40px;
            text-align: center;
            padding: 10px;
        `;

        //Criação dinâmica da div divinfoadd
        const divinfoadd = document.createElement('div');
        sectioncidadefornecida.appendChild(divinfoadd);

        const paragrafo4 = document.createElement('p');
        const paragrafo5 = document.createElement('p');
        const paragrafo6 = document.createElement('p');
        const paragrafo7 = document.createElement('p');
        divinfoadd.appendChild(paragrafo4);
        divinfoadd.appendChild(paragrafo5);
        divinfoadd.appendChild(paragrafo6);
        divinfoadd.appendChild(paragrafo7);

        //Conteúdo da div divinfoadd
        paragrafo4.innerHTML = `&#10052;&#65039; Temperatura mínima: ${dados.data_day.temperature_min[0]}°C`;
        paragrafo5.innerHTML = `&#9728;&#65039; Temperatura máxima: ${dados.data_day.temperature_max[0]}°C`;
        paragrafo6.innerHTML = `&#128167; Umidade relativa média: ${dados.data_day.relativehumidity_mean[0]}%`;
        paragrafo7.innerHTML = `&#127811; Velocidade média do vento: ${dados.data_day.windspeed_mean[0]} m/s`;

        //Estilo da div divinfoadd
        divinfoadd.style.cssText = `
            padding: 10px;
        `;
        paragrafo4.style.cssText = `
            color: rgba(0, 0, 0, 0.712);
            font-size: 20px;
            padding: 20px;
        `;
        paragrafo5.style.cssText = `
            rgba(0, 0, 0, 0.712);
            font-size: 20px;
            padding: 20px;
        `;
        paragrafo6.style.cssText = `
            rgba(0, 0, 0, 0.712);
            font-size: 20px;
            padding: 20px;
        `;
        paragrafo7.style.cssText = `
            rgba(0, 0, 0, 0.712);
            font-size: 20px;
            padding: 20px;
        `;
        
    } else {
        console.log('Elemento para exibir dados não encontrado.');
    }
}

botao.addEventListener("click", async () => {
    const valorCidade = itxtcidade.value;
    const valorCidade2 = itxtcidade.value.trim();

    if (valorCidade2 === "") {
        window.alert("Por favor, insira o nome de uma cidade.");
        return;
    }
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