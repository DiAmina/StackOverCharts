import config from './config.js';

import {
    getDevDataByContinent,
    getNbDevById,
    createSelectData, loadDoughnutChart, loadPieChart, updateChart
} from "./functions-libs.js";

// envoi de la requete ajax
let request = $.ajax({
    type: "GET",
    url: config.url
});

/**
 * Retourne un dictionnaire contenant les X outils les plus utilisés par les développeurs d'un certain type
 * @param data
 * @param devType
 * @param field
 * @returns {{}}
 */
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

/**
 * Retourne un dictionnaire contenant les top OS les plus utilisés par les développeurs d'un certain type
 * @param data
 * @param topX
 * @returns {{}}
 */
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

/**
 * Retourne un dictionnaire contenant les top outils de communication les plus utilisés par les développeurs d'un certain type
 * @param data
 * @param topX
 * @returns {{}}
 */
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

/**
 * Met à jour les charts en fonction des selects
 * @param chart
 * @param data
 * @param selectorDev
 * @param selectorCount
 * @param selectorContinent
 * @param typeMean
 */
function updateChartsWithSelect(chart, data, selectorDev, selectorCount,selectorContinent, typeMean) {
    let selectDevType = document.getElementById(selectorDev);
    let selectCount = document.getElementById(selectorCount);
    let selectContinent = document.getElementById(selectorContinent);

    let devType = selectDevType.options[selectDevType.selectedIndex].value;
    let count = selectCount.options[selectCount.selectedIndex].value;
    let continent = selectContinent.options[selectContinent.selectedIndex].value;

    let dataContinent = getDevDataByContinent(data, continent);

    if (typeMean === 'os') {
        let dataTop = getTopOsUsedByDevType(dataContinent,count);
        let dataOsUsedByDevType = getOsUsedByDevType(dataTop, devType);
        updateChart(chart, dataOsUsedByDevType[0], dataOsUsedByDevType[1]);
    } else if (typeMean === 'comTools') {
        let dataTop2 = getTopComToolsUsedByDevType(dataContinent,count);
        let dataComToolsUsedByDevType = getComToolsUsedByDevType(dataTop2, devType);
        updateChart(chart, dataComToolsUsedByDevType[0], dataComToolsUsedByDevType[1]);
    }
}

/**
 * Retourne les OS utilisés par les développeurs d'un certain type
 * @param data
 * @param devType
 * @returns {*[][]}
 */
function getOsUsedByDevType(data, devType) {
    let osNames = []; // noms des OS
    let numbers = []; // nombres de devs utilisant l'OS
    if (devType in data) {
        data[devType].forEach(element => {
            osNames.push(element[0]);
            numbers.push(element[1]);
        });
    }
    return [osNames, numbers];
}

/**
 * Retourne les outils de communication utilisés par les développeurs d'un certain type
 * @param data
 * @param devType
 * @returns {*[][]}
 */
function getComToolsUsedByDevType(data, devType) {
    let comToolsNames = []; // noms dees outils de com
    let numbers = []; // nombres de devs utilisant les outils de com
    if (devType in data) {
        data[devType].forEach(element => {
            comToolsNames.push(element[0]);
            numbers.push(element[1]);
        });
    }
    return [comToolsNames, numbers];

}

// Code à exécuter en cas de succès de la requête
request.done(function (output) {
    const dataContinent = getDevDataByContinent(output, 'Europe');
    let allDevTypes = Object.keys(getNbDevById(output, 'DevType')).sort();
    let dataTop = getTopOsUsedByDevType(dataContinent,5);
    createSelectData('selector', 'selectorDevType', allDevTypes,"Sélectionnez un métier",false);
    let data = getOsUsedByDevType(dataTop, allDevTypes[0]);
    let osChart = loadPieChart(data[0], data[1], 'OS','pieChartTopOS');
    let dataTop2 = getTopComToolsUsedByDevType(dataContinent,5);
    let data2 = getComToolsUsedByDevType(dataTop2, allDevTypes[0]);
    let comToolchart = loadDoughnutChart(data2[0], data2[1], 'Outils de communication','doughnutCommTool');

    const selectDevType = document.getElementById('selectorDevType');
    const selectCount = document.getElementById('selectorCount');
    const selectContinent = document.getElementById('selectorContinent');

    selectDevType.addEventListener('change', function () {
        updateChartsWithSelect(osChart, output, 'selectorDevType', 'selectorCount', 'selectorContinent', 'os');
        updateChartsWithSelect(comToolchart, output, 'selectorDevType', 'selectorCount', 'selectorContinent', 'comTools');
    });

    selectCount.addEventListener('change', function () {
        updateChartsWithSelect(osChart, output, 'selectorDevType', 'selectorCount', 'selectorContinent', 'os');
        updateChartsWithSelect(comToolchart, output, 'selectorDevType', 'selectorCount', 'selectorContinent', 'comTools')
    });

    selectContinent.addEventListener('change', function () {
        updateChartsWithSelect(osChart, output, 'selectorDevType', 'selectorCount', 'selectorContinent', 'os');
        updateChartsWithSelect(comToolchart, output, 'selectorDevType', 'selectorCount', 'selectorContinent', 'comTools')
    });

});

// Code à exécuter en cas d'échec de la requête
request.fail(function (httpError) {
    let server_msg = httpError.responseText;
    let code = httpError.status;
    let code_label = httpError.statusText;
    alert("Erreur " + code + " (" + code_label + ") : " + server_msg);
});