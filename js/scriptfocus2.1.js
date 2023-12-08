//Envoi de la requête vers le fichier de données JSON
 let request = $.ajax({
        type: "GET",
        url: "../data/survey_results.json"
    });

import {
    getDevDataByContinent,
    computeMeanSalary,
    getNbDevById
} from './functions-libs.js';

/**
 * Renvoie la moyenne des salaires en fonction des plateformes de cloud utilisées
 * @param data - Données JSON
 * @returns {{}} - Moyenne des salaires par plateformes de cloud [cloud: meanSalary]
 */
function getMeanSalaryByCloud(data) {
    let nbDevByCloud = getNbDevById(data, 'PlatformHaveWorkedWith')
    let meanSalaryByCloud = {};
    for (let cloud of Object.keys(nbDevByCloud)) {
        meanSalaryByCloud[cloud] = computeMeanSalary(data, cloud, 'PlatformHaveWorkedWith');
        if (!isNaN(meanSalaryByCloud[cloud])) {
            meanSalaryByCloud[cloud] = parseFloat(meanSalaryByCloud[cloud]);
        }

        if (meanSalaryByCloud[cloud] === 0) {
            meanSalaryByCloud[cloud] = NaN;
        }
    }
    return meanSalaryByCloud;
}

function getMeanSalaryByPlatform(data) {
    let nbDevByPlatform = getNbDevById(data, 'PlatformHaveWorkedWith')
    let meanSalaryByPlatform = {};
    for (let platform of Object.keys(nbDevByPlatform)) {
        meanSalaryByPlatform[platform] = computeMeanSalary(data, platform, 'PlatformHaveWorkedWith');
        if (!isNaN(meanSalaryByPlatform[platform])) {
            meanSalaryByPlatform[platform] = parseFloat(meanSalaryByPlatform[platform]);
        }

        if (meanSalaryByPlatform[platform] === 0) {
            meanSalaryByPlatform[platform] = NaN;
        }
    }
    return meanSalaryByPlatform;
}

// Code à exécuter en cas de succès de la requête
request.done(function (output) {
    const data = getDevDataByContinent(output, '');
    console.log(getMeanSalaryByCloud(output));
    console.log(getMeanSalaryByPlatform(output));
});

// Code à exécuter en cas d'échec de la requête
request.fail(function (httpError) {
    let server_msg = http_error.responseText;
    let code = http_error.status;
    let code_label = http_error.statusText;
    alert("Erreur " + code + " (" + code_label + ") : " + server_msg);
});


