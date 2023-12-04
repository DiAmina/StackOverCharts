// Envoi de la requête vers le fichier de données JSON
let request = $.ajax({
    type: "GET",
    url: "../data/survey_results.json"
});

import {
    getDevDataByContinent,
    getNbDevSalaryByEdu,
    getNbDevByEdu,
    computeMeanSalaryEtu,
    getMeanSalaryByEdu,
    convertCurrencyToEuro,
    minMaxSalary,

} from './script2';

import {
    createSelect,
    loadPolarAreaChart,
    AMERICA_COUNTRIES,
    createBr,
    EUROPE_COUNTRIES,
    getNbDevByExpYears,
    computeMeanSalary,
    getDevByCountry,
} from "./functions-libs";

function getMeanSalaryByEdu(data) {
    let nbDevByExpEdu = getNbDevByEdu(data)
    let meanSalaryByEdu = {};
    for (let edulevel of Object.keys(nbDevByExpEdu)) {
        meanSalaryByEdu[edulevel] = computeMeanSalary(data, edulevel);
        if (!isNaN(meanSalaryByEdu[edulevel])) {
            meanSalaryByEdu[edulevel] = parseFloat(meanSalaryByEdu[edulevel]);
        }

        if (meanSalaryByEdu [edulevel] === 0) {
            meanSalaryByEdu[edulevel] = NaN;
        }
    }
}

// Code à exécuter en cas de succès de la requête
request.done(function (output) {
    const dataContinent = getDevDataByContinent(output, 'Europe');
    const dataPays = getDevByCountry(dataContinent, 'Netherlands');
    let results = getMeanSalaryByEdu(dataPays);
    loadPolarAreaChart(Object.keys(results), Object.values(results), 'Salaire annuel par an (en €)','barChartporalAreaChartReportReport');

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
