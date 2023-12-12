import config from './config.js';

// Envoi de la requête vers le fichier de données JSON
let request = $.ajax({
    type: "GET",
    url: config.url
});

import {
    getDevDataByContinent,
    computeMeanSalary,
    getNbDevById,
    getDevByCountry,
    loadLineChartNaN,
    createSelect, loadPolarAreaChart,
    updateSelectParented, updateChart
} from './functions-libs.js';

/**
 * Renvoie la moyenne des salaires par années d'expérience
 * @param data - Données JSON
 * @returns {{}} - Moyenne des salaires par années d'expérience [yearsExp: meanSalary]
 */
function getMeanSalaryByExpYears(data) {
    let nbDevByExpYears = getNbDevById(data, 'YearsCodePro')
    let meanSalaryByExpYears = {};
    for (let yearsExp of Object.keys(nbDevByExpYears)) {
        meanSalaryByExpYears[yearsExp] = computeMeanSalary(data, yearsExp, 'YearsCodePro');
        if (!isNaN(meanSalaryByExpYears[yearsExp])) {
            meanSalaryByExpYears[yearsExp] = parseFloat(meanSalaryByExpYears[yearsExp]);
        }

        if (meanSalaryByExpYears[yearsExp] === 0) {
            meanSalaryByExpYears[yearsExp] = NaN;
        }
    }

    meanSalaryByExpYears["51"] = meanSalaryByExpYears["More than 50 years"];
    delete meanSalaryByExpYears["More than 50 years"];

    meanSalaryByExpYears["0"] = meanSalaryByExpYears["Less than 1 year"];
    delete meanSalaryByExpYears["Less than 1 year"];

    return meanSalaryByExpYears;
}

function getMeanSalaryByEdu(data) {
    let nbDevByExpEdu = getNbDevById(data, 'EdLevel')
    let meanSalaryByEdu = {};
    for (let edulevel of Object.keys(nbDevByExpEdu)) {
        meanSalaryByEdu[edulevel] = computeMeanSalary(data, edulevel, 'EdLevel');
        if (!isNaN(meanSalaryByEdu[edulevel])) {
            meanSalaryByEdu[edulevel] = parseFloat(meanSalaryByEdu[edulevel]);
        }

        if (meanSalaryByEdu [edulevel] === 0) {
            meanSalaryByEdu[edulevel] = NaN;
        }
    }
    return meanSalaryByEdu;
}

function updateChartsWithSelect(chart, data, selectorId, parent, type, typeMean) {
    let selectorValue = document.getElementById(selectorId);
    let selectorParent = document.getElementById(parent);
    let selected = selectorValue.options[selectorValue.selectedIndex].value;
    if (selected === 'none'){
        selected = selectorParent.options[selectorParent.selectedIndex].value;
        type = 'continent';
    }

    let dataSelected = null;

    if (type === 'country') {
        dataSelected = getDevByCountry(data, selected);

    } else if (type === 'continent') {
        dataSelected = getDevDataByContinent(data, selected);
    }

    if (typeMean === 'expYears') {
        let meanSalaryExpYears = getMeanSalaryByExpYears(dataSelected);
        updateChart(chart, Object.keys(meanSalaryExpYears), Object.values(meanSalaryExpYears));
    }
    else if (typeMean === 'edu') {
        let meanSalaryEdu = getMeanSalaryByEdu(dataSelected);
        updateChart(chart, Object.keys(meanSalaryEdu), Object.values(meanSalaryEdu));
    } else {
        throw new Error('Type de moyenne inconnu');
    }
}

// Code à exécuter en cas de succès de la requête
request.done(function (output) {
    const dataContinent = getDevDataByContinent(output, 'Europe');
    const dataPays = getDevByCountry(dataContinent, 'Netherlands');
    let meanSalaryExpYears = getMeanSalaryByExpYears(dataPays);
    let meanSalaryEdu = getMeanSalaryByEdu(dataContinent);
    let chartMeanExpYears= loadLineChartNaN(Object.keys(meanSalaryExpYears), Object.values(meanSalaryExpYears), 'Salaire annuel par an (en €)', 'barChartReport');
    let chartMeanEdu = loadPolarAreaChart(Object.keys(meanSalaryEdu), Object.values(meanSalaryEdu), 'Salaire annuel par an (en €)', 'poralAreaChartReport');
    createSelect('selector', 'selectorPays', 'selectorContinent')

    const selectorContinent = document.getElementById('selectorContinent');
    const selectorPays = document.getElementById('selectorPays');

    // On met à jour le select des pays en fonction du continent sélectionné
    selectorContinent.addEventListener('change', function () {
        updateSelectParented('selectorContinent', 'selectorPays');
    });

    // On met à jour les graphiques en fonction du pays sélectionné
    selectorPays.addEventListener('change', function () {
        updateChartsWithSelect(chartMeanExpYears, output, 'selectorPays', 'selectorContinent','country', 'expYears');
        updateChartsWithSelect(chartMeanEdu, output, 'selectorPays', 'selectorContinent','country', 'edu');
    });

    // On met à jour les graphiques en fonction du continent sélectionné
    selectorContinent.addEventListener('change', function () {
        updateChartsWithSelect(chartMeanExpYears, output, 'selectorContinent', null,'continent', 'expYears');
        updateChartsWithSelect(chartMeanEdu, output, 'selectorContinent', null,'continent', 'edu');
    });

});

// Code à exécuter en cas d'échec de la requête
request.fail(function (http_error) {
    let server_msg = http_error.responseText;
    let code = http_error.status;
    let code_label = http_error.statusText;
    alert("Erreur " + code + " (" + code_label + ") : " + server_msg);
});
