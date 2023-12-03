// Envoi de la requête vers le fichier de données JSON
let request = $.ajax({
    type: "GET",
    url: "../data/survey_results.json"
});

import {
    getDevDataByContinent, getNbDevSalaryByExpYears,
    computeMeanSalary, getNbDevByExpYears,
    loadLineChart, loadBarChart,
    loadPieChart, integrateData,
    getCountryList, convertCurrencyToEuro, getDevByCountry
} from './function-libs.js';

// Fonction renvoyant le nombre de personnes travaillant en remote
function remoteWork(data) {
    let remote = 0;
    const remoteVariant = ['Hybrid (some remote, some in-person)','Remote'];
    for (const element of data) {
        if (remoteVariant.includes(element['RemoteWork'])) {
            remote++;
        }
    }
    // pourcentage de personnes travaillant en remote
    let remotePercentage = remote / data.length * 100;
    return [remote,remotePercentage];
}


/*
    * Fonction renvoyant le le salaire moyen des développeurs par années d'expérience
    * Attention: Sachant que certains développeur n'ont pas renseigné leur salaire (CompTotal = 'NA'), ils ne seront pas pris en compte
    * @param data: données JSON
    * @param yearsExp: années d'expérience
    * @return meanSalaryByExpYears: salaire moyen des développeurs par années d'expérience
 */
function getMeanSalaryByExpYears(data) {
    let nbDevByExpYears = getNbDevByExpYears(data)
    let meanSalaryByExpYears = {};
    for (let yearsExp of Object.keys(nbDevByExpYears)) {
        meanSalaryByExpYears[yearsExp] = computeMeanSalary(data, yearsExp);
        if (!isNaN(meanSalaryByExpYears[yearsExp])) {
            meanSalaryByExpYears[yearsExp] = parseFloat(meanSalaryByExpYears[yearsExp]);
        }

        if (meanSalaryByExpYears[yearsExp] === 0) {
            meanSalaryByExpYears[yearsExp] = NaN;
        }
    }

    meanSalaryByExpYears["50"] = meanSalaryByExpYears["More than 50 years"];
    delete meanSalaryByExpYears["More than 50 years"];

    meanSalaryByExpYears["0"] = meanSalaryByExpYears["Less than 1 year"];
    delete meanSalaryByExpYears["Less than 1 year"];

    return meanSalaryByExpYears;
}

// Code à exécuter en cas de succès de la requête
request.done(function (output) {
    const data = getDevDataByContinent(output, 'America');

    let remote = remoteWork(output);
    integrateData(remote[0],'remotecount');
    integrateData(remote[1].toFixed(2),'remotepercentage',"%");
    integrateData(output.length,'totalcount');
    let countries = getCountryList(output);
    loadBarChart(countries.map(x => x[0]), countries.map(x => x[1]), "Nombre de personnes", "barChartReport");

});

// Code à exécuter en cas d'échec de la requête
request.fail(function (http_error) {
    let server_msg = http_error.responseText;
    let code = http_error.status;
    let code_label = http_error.statusText;
    alert("Erreur " + code + " (" + code_label + ") : " + server_msg);
});
