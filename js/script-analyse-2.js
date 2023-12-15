import config from './config.js';

import {
    createSelect, createSelectData,
    getDevByCountry, getDevByExpYEars,
    getDevDataByContinent, getDevSalaryByFieldSplitted,
    getNbDevByFieldSplitted, getNbDevById,
    loadBarChart, loadDoughnutChart, scatterChart,
    updateChart, updateSelectParented
} from "./functions-libs.js";

//envoi de la requete ajax
let request = $.ajax({
    type: "GET",
    url: config.url
});

/**
 * Fonction renvoyant le salaire moyen en fonction de la plateforme de cloud choisie
 * @param data
 * @param value
 * @param field
 * @returns {number}
 */
function computeMeanSalaryByCF(data, value, field) {
    let salaries = getDevSalaryByFieldSplitted(data, value, field);
    let sum = 0;
    for (const salary of salaries) {
        sum += parseFloat(salary);
    }
    let result = (sum / salaries.length).toFixed(2);
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
    let nbDevByCloud = getNbDevByFieldSplitted(data, 'PlatformHaveWorkedWith');
    let meanSalaryByCloud = {};
    for (let cloud of Object.keys(nbDevByCloud)) {
        let computedMeanSalary = computeMeanSalaryByCF(data, cloud, 'PlatformHaveWorkedWith');
        if (isNaN(computedMeanSalary)) {
            continue;
        }
        meanSalaryByCloud[cloud] = computeMeanSalaryByCF(data, cloud, 'PlatformHaveWorkedWith');
    }

    // tri du tableau par ordre décroissant des salaires
    let sortable = [];
    for (let cloud of Object.keys(meanSalaryByCloud)) {
        sortable.push([cloud, meanSalaryByCloud[cloud]]);
    }
    sortable.sort(function(a, b) {
        return b[1] - a[1];
    });
    meanSalaryByCloud = {};
    for (let cloud of sortable) {
        meanSalaryByCloud[cloud[0]] = cloud[1];
    }
    return meanSalaryByCloud;
}

function getMeanSalaryByFrameWork(data) {
    let nbDevByFrameWork = getNbDevByFieldSplitted(data, 'WebframeHaveWorkedWith');
    let meanSalaryByFrameWork = {};
    for (let frameWork of Object.keys(nbDevByFrameWork)) {
        let computedMeanSalary = computeMeanSalaryByCF(data, frameWork, 'WebframeHaveWorkedWith');
        if (isNaN(computedMeanSalary)) {
            continue;
        }
        meanSalaryByFrameWork[frameWork] = computeMeanSalaryByCF(data, frameWork, 'WebframeHaveWorkedWith');
    }

    // tri du tableau par ordre décroissant des salaires
    let sortable = [];
    for (let frameWork of Object.keys(meanSalaryByFrameWork)) {
        sortable.push([frameWork, meanSalaryByFrameWork[frameWork]]);
    }
    sortable.sort(function(a, b) {
        return b[1] - a[1];
    });
    meanSalaryByFrameWork = {};
    for (let frameWork of sortable) {
        meanSalaryByFrameWork[frameWork[0]] = frameWork[1];
    }
    return meanSalaryByFrameWork;
}


// ====== PARAMETRES ====== //
function updateChartsWithSelect(chart, data, selectorId, parent, type, typeMean) {
    let selectorValue = document.getElementById(selectorId);
    let selected = selectorValue.options[selectorValue.selectedIndex].value;
    let dataSelected = null;

    // Si le sélecteur correspond à l'année d'expérience
    if (selectorId === 'selectorYearsExp') {
        console.log(selected);
        // Si il est null
        if (selected === 'none') {
            // On récupère les données en fonction du pays sélectionné précédemment
            selectorValue = document.getElementById('selectorPays');
            selected = selectorValue.options[selectorValue.selectedIndex].value;
            console.log(selected);

            // Si aucun pays n'est sélectionné, on récupère les données en fonction du continent sélectionné
            if (selected === 'none') {
                selectorValue = document.getElementById('selectorContinent');
                selected = selectorValue.options[selectorValue.selectedIndex].value;
                dataSelected = getDevDataByContinent(data, selected);
                console.log(selected);
            } else {
                dataSelected = getDevByCountry(data,selected);
                console.log(selected);
            }
        } else {
            // On récupère les données en fonction du pays sélectionné
            let selectorValuePays = document.getElementById('selectorPays');
            let selectedPays = selectorValuePays.options[selectorValuePays.selectedIndex].value;
            if (selectedPays === 'none'){
                let selectorValueContinent = document.getElementById('selectorContinent');
                let selectedContinent = selectorValueContinent.options[selectorValueContinent.selectedIndex].value;
                dataSelected = getDevDataByContinent(data, selectedContinent);
                dataSelected = getDevByExpYEars(dataSelected,selected);
            } else {
                dataSelected = getDevByCountry(data,selectedPays)
                dataSelected = getDevByExpYEars(dataSelected,selected);
            }

        }
    } else {
        let selectorYearsExp = document.getElementById('selectorYearsExp');
        let selectedYearsExp = selectorYearsExp.options[selectorYearsExp.selectedIndex].value;
        if (type === 'country') {
            let selectorValuePays = document.getElementById('selectorPays');
            let selectedPays = selectorValuePays.options[selectorValuePays.selectedIndex].value;

            if (selectedPays === 'none') {
                let selectorValueContinent = document.getElementById('selectorContinent');
                let selectedContinent = selectorValueContinent.options[selectorValueContinent.selectedIndex].value;
                dataSelected = getDevDataByContinent(data, selectedContinent);
                if (selectedYearsExp !== 'none') {
                    dataSelected = getDevByExpYEars(dataSelected, selectedYearsExp);
                }
                console.log(selectedContinent);
            } else {
                dataSelected = getDevByCountry(data, selectedPays);
                if (selectedYearsExp !== 'none') {
                    dataSelected = getDevByExpYEars(dataSelected, selectedYearsExp);
                }
                console.log(selectedPays);
            }
        } else if (type === 'continent') {
            let selectorValueContinent = document.getElementById('selectorContinent');
            let selectedContinent = selectorValueContinent.options[selectorValueContinent.selectedIndex].value;
            dataSelected = getDevDataByContinent(data, selectedContinent);
            if (selectedYearsExp !== 'none') {
                dataSelected = getDevByExpYEars(dataSelected, selectedYearsExp);
            }
            console.log(selectedContinent);
        } else {
            throw new Error('Type de données inconnu');
        }
    }

    if (typeMean === 'cloud') {
        let meanSalaryByCloud = getMeanSalaryByCloud(dataSelected);
        updateChart(chart, Object.keys(meanSalaryByCloud), Object.values(meanSalaryByCloud));
    } else if (typeMean === 'frameWork') {
        let meanSalaryByFrameWork = getMeanSalaryByFrameWork(dataSelected);
        updateChart(chart, Object.keys(meanSalaryByFrameWork), Object.values(meanSalaryByFrameWork));
    }
}
// ====== FIN PARAMETRES ====== //

// Code à exécuter en cas de succès de la requête
request.done(function (output) {
    const dataContinent = getDevDataByContinent(output, 'Europe');
    let meanSalaryByCloud = getMeanSalaryByCloud(dataContinent);
    let chartMeanCloud = loadBarChart(
        Object.keys(meanSalaryByCloud),
        Object.values(meanSalaryByCloud),
        'Salaire moyen annuel par an (en €)',
        'barChartCloudPlatform'
    );

    let chartMeanFrameWork = scatterChart(
        Object.keys(getMeanSalaryByFrameWork(dataContinent)),
        Object.values(getMeanSalaryByFrameWork(dataContinent)),
        'Salaire moyen annuel par an (en €)',
        'scatterChartFrameWork'
    );
    createSelect('selector', 'selectorPays', 'selectorContinent');
    createSelectData('selector', 'selectorYearsExp', Object.keys(getNbDevById(output, 'YearsCodePro')),"Séléctionner une année");

    const selectorContinent = document.getElementById('selectorContinent');
    const selectorPays = document.getElementById('selectorPays');
    const selectorExpYears = document.getElementById('selectorYearsExp');

    // On met à jour le select des pays en fonction du continent sélectionné
    selectorContinent.addEventListener('change', function () {
        updateSelectParented('selectorContinent', 'selectorPays');
    });

    // On met à jour les graphiques en fonction du continent sélectionné
    selectorContinent.addEventListener('change', function () {
        updateChartsWithSelect(chartMeanCloud, output, 'selectorContinent', null,'continent', 'cloud');
        updateChartsWithSelect(chartMeanFrameWork, output, 'selectorContinent', null,'continent', 'frameWork')
    });

    // On met à jour les graphiques en fonction du pays sélectionné
    selectorPays.addEventListener('change', function () {
        updateChartsWithSelect(chartMeanCloud, output, 'selectorPays', 'selectorContinent','country', 'cloud');
        updateChartsWithSelect(chartMeanFrameWork, output, 'selectorPays', 'selectorContinent','country', 'frameWork')
    });

    // On met à jour les graphiques en fonction de l'année d'expérience sélectionnée
    selectorExpYears.addEventListener('change', function () {
        updateChartsWithSelect(chartMeanCloud, output, 'selectorYearsExp', 'selectorContinent','expYears', 'cloud');
        updateChartsWithSelect(chartMeanFrameWork, output, 'selectorYearsExp', 'selectorContinent','expYears', 'frameWork')
    });

});

// Code à exécuter en cas d'échec de la requête
request.fail(function (httpError) {
    let server_msg = httpError.responseText;
    let code = httpError.status;
    let code_label = httpError.statusText;
    alert("Erreur " + code + " (" + code_label + ") : " + server_msg);
});
