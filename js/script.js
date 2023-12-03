// Envoi de la requête vers le fichier de données JSON
import {
    getDevDataByContinent,
    getNbDevSalaryByExpYears,
    computeMeanSalary, getDevByCountry
} from './function-libs.js';

let request = $.ajax({
    type: "GET",
    url: "../data/survey_results.json"
});

/*
    * Fonction renvoyant le le salaire moyen des développeurs par années d'expérience
    * Attention: Sachant que certains développeur n'ont pas renseigné leur salaire (CompTotal = 'NA'), ils ne seront pas pris en compte
    * @param data: données JSON
    * @param yearsExp: années d'expérience
    * @return meanSalaryByExpYears: salaire moyen des développeurs par années d'expérience
 */
function getMeanSalaryByExpYears(data) {
    let nbDevByExpYears = getNbDevSalaryByExpYears(data, "7")
    let meanSalaryByExpYears = {};
    for (let yearsExp of Object.keys(nbDevByExpYears)) {
        meanSalaryByExpYears[yearsExp] = computeMeanSalary(data, yearsExp);
    }
    return meanSalaryByExpYears;
}

// Code à exécuter en cas de succès de la requête
request.done(function (output) {
    const data = getDevDataByContinent(output,"Europe");
    const data2 = getDevByCountry(data,"France")
    console.log(data2);
    console.log(getNbDevSalaryByExpYears(data,"7"));
    console.log(computeMeanSalary(data,"7"));
});

// Code à exécuter en cas d'échec de la requête
request.fail(function (http_error) {
    let server_msg = http_error.responseText;
    let code = http_error.status;
    let code_label = http_error.statusText;
    alert("Erreur " + code + " (" + code_label + ") : " + server_msg);
});
