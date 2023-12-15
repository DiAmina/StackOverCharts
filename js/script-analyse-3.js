import config from './config.js';

import {
    getDevDataByContinent,
    getNbDevByFieldSplitted,
    getNbDevById,
    loadStackedBarChart,
    createSelectData,
    createSelect, loadDoughnutChart, loadPieChart, updateChart
} from "./functions-libs.js";

// envoi de la requete ajax
let request = $.ajax({
    type: "GET",
    url: config.url
});

function getTopXUsedByDevType(data, devType, field) {
    let topXUsed = {};
    for (const developer of data) {
        if (developer['DevType'] === devType) {
            let x_used = developer[field].split(';');
            if (x_used[0] === 'NA' || x_used[0] === '' || x_used.includes('NA')) {
                continue;
            }
            for (const x of x_used) {
                if (topXUsed[x] === undefined) {
                    topXUsed[x] = 1;
                } else {
                    topXUsed[x]++;
                }
            }
        }
    }
    // sort
    let sortable = [];
    for (const x in topXUsed) {
        sortable.push([x, topXUsed[x]]);
    }
    sortable.sort(function (a, b) {
        return b[1] - a[1];
    });
    let topX = {};
    for (let i = 0; i < 8; i++) {
        topX[sortable[i][0]] = sortable[i][1];
    }
    return topX;
}

function getTopOsUsedByDevType(data, topX = 8){
    let topOsUsed = {};
    let devTypes = Object.keys(getNbDevById(data, 'DevType'));
    for (const devType of devTypes) {
        let topXUsed = Object.entries(getTopXUsedByDevType(data, devType, 'OpSysProfessionaluse'));
        topOsUsed[devType] = topXUsed.slice(0, topX);
    }

    // sort by keys
    let sorted = {};
    Object.keys(topOsUsed).sort().forEach(function(key) {
        sorted[key] = topOsUsed[key];
    });
    return sorted;
}

function getTopComToolsUsedByDevType(data, topX = 8){
    let topComToolsUsed = {};
    let devTypes = Object.keys(getNbDevById(data, 'DevType'));
    for (const devType of devTypes) {
        let topXUsed = Object.entries(getTopXUsedByDevType(data, devType, 'OfficeStackSyncHaveWorkedWith'));
        topComToolsUsed[devType] = topXUsed.slice(0, topX);
    }

    // sort by keys
    let sorted = {};
    Object.keys(topComToolsUsed).sort().forEach(function(key) {
        sorted[key] = topComToolsUsed[key];
    });
    return sorted;

}

function updateChartsWithSelect(chart, data, selectorDev, selectorCount,selectorContinent) {
    let selectDevType = document.getElementById(selectorDev);
    let selectCount = document.getElementById(selectorCount);
    let selectContinent = document.getElementById(selectorContinent);

    let devType = selectDevType.options[selectDevType.selectedIndex].value;
    let count = selectCount.options[selectCount.selectedIndex].value;
    let continent = selectContinent.options[selectContinent.selectedIndex].value;

    let dataContinent = getDevDataByContinent(data, continent);
    let dataTop = getTopOsUsedByDevType(dataContinent,count);
    let dataOsUsedByDevType = getOsUsedByDevType(dataTop, devType);
    updateChart(chart, dataOsUsedByDevType[0], dataOsUsedByDevType[1]);

    //parti chart 2
    let dataTop2 = getTopComToolsUsedByDevType(dataContinent,count);
    let dataComToolsUsedByDevType = getComToolsUsedByDevType(dataTop2, devType);
    updateChart(chart, dataComToolsUsedByDevType[0], dataComToolsUsedByDevType[1]);
}

function getOsUsedByDevType(data, devType) {
    let osNames = []; // noms des OS
    let numbers = []; // nombres de devs utilisant l'OS
    if (devType in data) {
        let x_used = data[devType].forEach(element => {
            osNames.push(element[0]);
            numbers.push(element[1]);
        });
    }
    return [osNames, numbers];
}

function getComToolsUsedByDevType(data, devType) {
    let comToolsNames = []; // noms dees outils de com
    let numbers = []; // nombres de devs utilisant les outils de com
    if (devType in data) {
        let x_used = data[devType].forEach(element => {
            comToolsNames.push(element[0]);
            numbers.push(element[1]);
        });
    }
    return [comToolsNames, numbers];

}
// ====================

// Code à exécuter en cas de succès de la requête
request.done(function (output) {
    const dataContinent = getDevDataByContinent(output, 'Europe');
    let allDevTypes = Object.keys(getNbDevById(output, 'DevType')).sort();
    let dataTop = getTopOsUsedByDevType(dataContinent,5);
    createSelectData('selector', 'selectorDevType', allDevTypes,"Sélectionnez un métier",false);
    let data = getOsUsedByDevType(dataTop, allDevTypes[0]);

    console.log(dataTop);
    console.log(data);

    let osChart = loadPieChart(data[0], data[1], 'OS','pieChartTopOS');

    // TODO: Rajoute le 2e chart ici

    let dataTop2 = getTopComToolsUsedByDevType(dataContinent,5);
    let data2 = getComToolsUsedByDevType(dataTop2, allDevTypes[0]);

    console.log(data2);

    let comToolchart = loadDoughnutChart(data2[0], data2[1], 'Outils de communication','doughnutCommTool');


    const selectDevType = document.getElementById('selectorDevType');
    const selectCount = document.getElementById('selectorCount');
    const selectContinent = document.getElementById('selectorContinent');

    selectDevType.addEventListener('change', function () {
        updateChartsWithSelect(osChart, output, 'selectorDevType', 'selectorCount', 'selectorContinent');
        updateChartsWithSelect(comToolchart, output, 'selectorDevType', 'selectorCount', 'selectorContinent')
    });

    selectCount.addEventListener('change', function () {
        updateChartsWithSelect(osChart, output, 'selectorDevType', 'selectorCount', 'selectorContinent');
        updateChartsWithSelect(comToolchart, output, 'selectorDevType', 'selectorCount', 'selectorContinent')
    });

    selectContinent.addEventListener('change', function () {
        updateChartsWithSelect(osChart, output, 'selectorDevType', 'selectorCount', 'selectorContinent');
        updateChartsWithSelect(comToolchart, output, 'selectorDevType', 'selectorCount', 'selectorContinent')
    });

});

// Code à exécuter en cas d'échec de la requête
request.fail(function (httpError) {
    let server_msg = httpError.responseText;
    let code = httpError.status;
    let code_label = httpError.statusText;
    alert("Erreur " + code + " (" + code_label + ") : " + server_msg);
});