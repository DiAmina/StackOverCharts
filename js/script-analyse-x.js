// Envoi de la requête vers le fichier de données JSON
let request = $.ajax({
    type: "GET",
    url: "../data/survey_results.json"
});

import {
    getNbDevSalaryByEdu,
} from './script2.js';

import {
    getDevDataByContinent,
    loadPolarAreaChart,
    AMERICA_COUNTRIES,
    EUROPE_COUNTRIES,
    computeMeanSalary,
    getDevByCountry,getNbDevById,
} from "./functions-libs.js";

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
    let results = getMeanSalaryByEdu(dataPays);
    console.log(results);
    loadPolarAreaChart(Object.keys(results), Object.values(results), 'Salaire annuel par an (en €)','poralAreaChartReport');
});

// Code à exécuter en cas d'échec de la requête
request.fail(function (http_error) {
    let server_msg = http_error.responseText;
    let code = http_error.status;
    let code_label = http_error.statusText;
    alert("Erreur " + code + " (" + code_label + ") : " + server_msg);
});
