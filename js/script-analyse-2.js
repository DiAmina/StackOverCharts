import {
    computeMeanSalary,
    getDevByCountry,
    getDevByExpYEars,
    getDevDataByContinent,
    getDevSalaryById,
    getNbDevById,
    getValues,
    unwind
} from "./functions-libs.js";

//envoi de la requete ajax
let request = $.ajax({
    type: "GET",
    url: "../data/survey_results.json"
});


// ====== SALAIRE MOYEN PAR PLATEFORME DE CLOUD ====== //
/**
 * Fonction renvoyant le nombre de développeurs ayant travaillé avec des plateformes de cloud
 * @param data
 * @returns {{}}
 */
function getNbDevByCloud(data) {
    let nbDevByCloud = {};
    for (const developer of data) {
        let devClouds = developer['PlatformHaveWorkedWith'].split(';');
        if (devClouds[0] === 'NA' || devClouds[0] === '' || devClouds.includes('NA')) {
            continue;
        }
        for (const devCloud of devClouds){
            if (nbDevByCloud[devCloud] === undefined){
                nbDevByCloud[devCloud] = 1;
            } else {
                nbDevByCloud[devCloud] += 1;
            }
        }
    }
    return nbDevByCloud;
}

/**
 * Fonction renvoyant le salaire des développeurs ayant travaillé avec la plateforme de cloud choisie
 * @param data
 * @param value
 * @returns {*[]}
 */
function getDevSalaryByCloud(data, value){
    let devSalaries = []
    for (const developer of data) {
        let devClouds = developer['PlatformHaveWorkedWith'].split(';');
        if (devClouds[0] === 'NA' || devClouds[0] === '' || devClouds.includes('NA')) {
            continue;
        }
        if (devClouds.includes(value)) {
            getValues(developer, devSalaries);
        }
    }
    return devSalaries;
}

/**
 * Fonction renvoyant le salaire moyen en fonction de la plateforme de cloud choisie
 * @param data
 * @param value
 * @returns {number}
 */
function computeMeanSalaryByCloud(data, value) {
    let salaries = getDevSalaryByCloud(data, value);
    let sum = 0;
    for (const salary of salaries) {
        sum += parseFloat(salary);
    }
    let result = parseFloat((sum / salaries.length).toFixed(2));
    return result === 'NaN' ? NaN : result;
}

/**
 * Fonction renvoyant le salaire moyen par plateforme de cloud
 *
 * Attention : les développeurs ayant travaillé avec plusieurs plateformes de cloud sont comptés plusieurs fois
 * @param data
 * @returns {{}}
 */
function getMeanSalaryByCloud(data) {
    let nbDevByCloud = getNbDevByCloud(data);
    let meanSalaryByCloud = {};
    for (let cloud of Object.keys(nbDevByCloud)) {
        let computedMeanSalary = computeMeanSalaryByCloud(data, cloud);
        if (isNaN(computedMeanSalary)) {
            continue;
        }
        meanSalaryByCloud[cloud] = computeMeanSalaryByCloud(data, cloud);
    }
    return meanSalaryByCloud;
}
// ====== FIN SALAIRE MOYEN PAR PLATEFORME DE CLOUD ====== //


// Code à exécuter en cas de succès de la requête
request.done(function (output) {
    const dataContinent = getDevDataByContinent(output, 'Amérique');
    const dataPays = getDevByCountry(dataContinent, 'Canada');
    const dataExpYears = getDevByExpYEars(dataPays, '25');
    let meanSalaryByCloud = getMeanSalaryByCloud(dataExpYears);
    console.log("CLOUD TEST")
    console.log(meanSalaryByCloud);
});

// Code à exécuter en cas d'échec de la requête
request.fail(function (httpError) {
    let server_msg = httpError.responseText;
    let code = httpError.status;
    let code_label = httpError.statusText;
    alert("Erreur " + code + " (" + code_label + ") : " + server_msg);
});


