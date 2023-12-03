// Envoi de la requête vers le fichier de données JSON
import {
    getDevDataByContinent,
    getNbDevSalaryByExpYears,
    computeMeanSalary
} from './function-libs.js';


let request = $.ajax({
    type: "GET",
    url: "../data/survey_results.json"
});

// Code à exécuter en cas de succès de la requête
request.done(function (output) {
    const data = getDevDataByContinent(output,"Europe");
    console.log(data);
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
