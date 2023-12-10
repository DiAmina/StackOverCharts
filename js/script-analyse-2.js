import {
    createSelect, createSelectData,
    getDevByCountry,
    getDevByExpYEars,
    getDevDataByContinent, getNbDevById,
    getValues, loadBarChart, updateChart, updateSelectParented
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
// ====== FIN SALAIRE MOYEN PAR PLATEFORME DE CLOUD ====== //


// ====== PARAMETRES ====== //
function updateChartsWithSelect(chart, data, selectorId, parent, type, typeMean) {
    let selectorValue = document.getElementById(selectorId);
    let selectorParent = document.getElementById(parent);
    let selected = selectorValue.options[selectorValue.selectedIndex].value;
    if (selected === 'none'){
        selected = selectorParent.options[selectorParent.selectedIndex].value;
        type = 'country';
        // si le selector country est sur none, on met le selector sur le continent
        selectorValue = document.getElementById('selectorPays');
        selected = selectorValue.options[selectorValue.selectedIndex].value;
        if (selected === 'none'){
            selected = selectorParent.options[selectorParent.selectedIndex].value;
            type = 'continent';
        }
    }

    let dataSelected = null;

    if (type === 'country') {
        dataSelected = getDevByCountry(data, selected);
    }

    if (type === 'continent') {
        dataSelected = getDevDataByContinent(data, selected);
    }

    if (type === 'expYears') {
        if (!(dataSelected === null)) {
            dataSelected = getDevByExpYEars(dataSelected, selected);
        } else {
            dataSelected = getDevByExpYEars(data, selected);
        }
    }

    if (typeMean === 'cloud') {
        let meanSalaryEdu = getMeanSalaryByCloud(dataSelected);
        updateChart(chart, Object.keys(meanSalaryEdu), Object.values(meanSalaryEdu));
    } else {
        throw new Error('Type de moyenne inconnu');
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
    createSelect('selector', 'selectorPays', 'selectorContinent');
    createSelectData('selector', 'selectorYearsExp', Object.keys(getNbDevById(output, 'YearsCodePro')));

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
    });

    // On met à jour les graphiques en fonction du pays sélectionné
    selectorPays.addEventListener('change', function () {
        updateChartsWithSelect(chartMeanCloud, output, 'selectorPays', 'selectorContinent','country', 'cloud');
    });

    // On met à jour les graphiques en fonction de l'année d'expérience sélectionnée
    selectorExpYears.addEventListener('change', function () {
        updateChartsWithSelect(chartMeanCloud, output, 'selectorYearsExp', 'selectorContinent','expYears', 'cloud');
    });

});

// Code à exécuter en cas d'échec de la requête
request.fail(function (httpError) {
    let server_msg = httpError.responseText;
    let code = httpError.status;
    let code_label = httpError.statusText;
    alert("Erreur " + code + " (" + code_label + ") : " + server_msg);
});
