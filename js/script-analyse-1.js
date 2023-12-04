// Envoi de la requête vers le fichier de données JSON
let request = $.ajax({
    type: "GET",
    url: "../data/survey_results.json"
});

import {
    getDevDataByContinent,
    computeMeanSalary,
    getNbDevById,
    getDevByCountry,
    loadLineChartNaN,
    createSelect,
    AMERICA_COUNTRIES, createBr,
    EUROPE_COUNTRIES, loadPolarAreaChart
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

// Code à exécuter en cas de succès de la requête
request.done(function (output) {
    const dataContinent = getDevDataByContinent(output, 'Europe');
    const dataPays = getDevByCountry(dataContinent, 'Netherlands');
    let results = getMeanSalaryByExpYears(dataPays);
    loadLineChartNaN(Object.keys(results), Object.values(results), 'Salaire annuel par an (en €)','barChartReport');
    loadPolarAreaChart(Object.keys(results), Object.values(results), 'Salaire annuel par an (en €)','poralAreaChartReport');
    createSelect(["Amérique","Europe"],"selectorContinent","selector");
    createBr("selector")
    createSelect(EUROPE_COUNTRIES,"selectorPays","selector");
});

// Code à exécuter en cas d'échec de la requête
request.fail(function (http_error) {
    let server_msg = http_error.responseText;
    let code = http_error.status;
    let code_label = http_error.statusText;
    alert("Erreur " + code + " (" + code_label + ") : " + server_msg);
});
