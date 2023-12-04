//envoi de la requete ajax
import {
    computeMeanSalaryEtu,
    getNbDevSalaryByEdu,
    getNbDevByEdu
} from './script2.js';


let request = $.ajax({
    type: "GET",
    url: "../data/survey_results.json"
});

/*
    * Fonction renvoyant le le salaire moyen des développeurs par niveau d'étude
    * Attention: Sachant que certains développeur n'ont pas renseigné leur salaire (CompTotal = 'NA'), ils ne seront pas pris en compte
    * @param data: données JSON
    * @param yearsExp: niveau d'étude
    * @return meanSalaryByEdLevel: salaire moyen des développeurs par niveau d'expérience fonction renvoyant le salaire moyen des développeurs par niveau d'étude
 */
 function getMeanSalaryByEdu(data) {
    let nbDevByEdu = getNbDevByEdu(data);
    let meanSalaryByEdu = {};
    for (let edu of Object.keys(nbDevByEdu)) {
        meanSalaryByEdu[edu] = computeMeanSalaryEtu(data, edu);
    }
    return meanSalaryByEdu;
}

// Code à exécuter en cas de succès de la requête
request.done(function (output) {
    const data = getNbDevByEdu(output, '');
    console.log(getMeanSalaryByEdu(output));
});

// Code à exécuter en cas d'échec de la requête

request.fail(function (httpError) {
    let server_msg = http_error.responseText;
    let code = http_error.status;
    let code_label = http_error.statusText;
    alert("Erreur " + code + " (" + code_label + ") : " + server_msg);
});








