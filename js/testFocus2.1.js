import {
    computeMeanSalaryCloud,
    getNbDevByCloud,
    getNbDevSalaryByCloud,
} from "./fonction2.1.js";

//envoi de la requete ajax
let request = $.ajax({
    type: "GET",
    url: "../data/survey_results.json"
});

import {
    getDevDataByContinent,
    computeMeanSalary,
    getDevByCountry,
    loadLineChartNaN,
    createSelect,
    AMERICA_COUNTRIES, createBr,
    EUROPE_COUNTRIES, loadPolarAreaChart
} from './functions-libs.js';

function getNbDevById(data,attribut) {
    let results = {};
    for (const developer of data) {
        let label = developer[attribut];
        if (label === 'NA') {
            continue;
        }

        if (results[label] === undefined) {
            results[label] = 1;
        } else {
            results[label] += 1;
        }
    }
    return results;
}
function loadBarChart(x, y, label,id) {
    let ctx = document.getElementById(id).getContext('2d');
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: x,
            datasets: [{
                label: label,
                data: y,
                backgroundColor: [
                    'rgba(16,57,147,0.8)',
                ],
                borderColor: [
                    'rgb(180,196,245)',
                ],
                borderWidth: 3
            }]
        },
        options: {}
    });
}

/*
    * Fonction renvoyant le le salaire moyen des développeurs en fonction des plateformes de cloud avec lesquelles il a travaillé
    * Attention: Sachant que certains développeur n'ont pas renseigné leur salaire (CompTotal = 'NA'), ils ne seront pas pris en compte
    * @param data: données JSON
    * @param yearsExp: niveau d'étude
    * @return meanSalaryByEdLevel: salaire moyen des développeurs par niveau d'expérience fonction renvoyant le salaire moyen des développeurs par plateformes de cloud
 */
function getMeanSalaryByCloud(data) {
    let nbDevByCloud = getNbDevByCloud(data);
    let meanSalaryByCloud = {};
    for (let cloud of Object.keys(nbDevByCloud)) {
        meanSalaryByCloud[cloud] = computeMeanSalaryCloud(data, cloud);

    }
    return meanSalaryByCloud;
}

/**
 * Renvoie le salaire le plus petit et le plus grand
 * @param data - Données JSON
 * @returns {number[]} - [Salaire minimum, Salaire maximum]
 */

function minMaxSalary(data) {
    let min = Math.min(...data);
    let max = Math.max(...data);
    return [min, max];
}

// Code à exécuter en cas de succès de la requête
request.done(function (output) {
    const data = getNbDevByCloud(output);
    console.log("TEST")
    //trier par ordre décroissant
    const dataArray = Object.entries(data);

    // Tri du tableau par ordre décroissant en fonction du nombre de développeurs
    dataArray.sort((a, b) => b[1] - a[1]);

    // Récupération des clés triées et des valeurs triées
    const sortedKeys = dataArray.map(entry => entry[0]);
    const sortedValues = dataArray.map(entry => entry[1]);

    console.log(getMeanSalaryByCloud(output));
    console.log(minMaxSalary(getNbDevSalaryByCloud(output,'NA')))
    loadBarChart(sortedKeys,sortedValues, 'Nombre de développeurs','barchartTest');
    createSelect(["Amérique","Europe"],"selectorContinent","selector");
    createBr("selector")
    createSelect(EUROPE_COUNTRIES,"selectorPays","selector");
    console.log(getNbDevById(output,'YearsCodePro'));

});

// Code à exécuter en cas d'échec de la requête

request.fail(function (httpError) {
    let server_msg = http_error.responseText;
    let code = http_error.status;
    let code_label = http_error.statusText;
    alert("Erreur " + code + " (" + code_label + ") : " + server_msg);
});


