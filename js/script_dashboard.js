import config from './config.js';

// Envoi de la requête vers le fichier de données JSON
let request = $.ajax({
    type: "GET",
    url: config.url
});

import {
    getDevDataByContinent, loadBarChart,
    integrateData, getNbDevByCountry
} from './functions-libs.js';

/**
 * Fonction qui permet de compter le nombre de personnes travaillant en remote
 * @param data
 * @returns {(number|number)[]}
 */
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

// Code à exécuter en cas de succès de la requête
request.done(function (output) {
    let remote = remoteWork(output);
    integrateData(remote[0],'remotecount');
    integrateData(remote[1].toFixed(2),'remotepercentage',"%");
    integrateData(output.length,'totalcount');
    let countries = getNbDevByCountry(output);
    loadBarChart(countries.map(x => x[0]), countries.map(x => x[1]), "Nombre de personnes", "barChartReport");
});

// Code à exécuter en cas d'échec de la requête
request.fail(function (http_error) {
    let server_msg = http_error.responseText;
    let code = http_error.status;
    let code_label = http_error.statusText;
    alert("Erreur " + code + " (" + code_label + ") : " + server_msg);
});
