import config from './config.js';

import {getDevDataByContinent, getNbDevByFieldSplitted, getNbDevById, loadStackedBarChart, createSelectData} from "./functions-libs.js";

// envoi de la requete ajax
let request = $.ajax({
    type: "GET",
    url: config.url
});

function getTopXUsedByDevType(data, devType, field) {
    let topXUsed = {};
    for (const developer of data) {
        if (developer['DevType'] === devType) {
            let x_used = developer[field].split(';');
            if (x_used[0] === 'NA' || x_used[0] === '' || x_used.includes('NA')) {
                continue;
            }
            for (const x of x_used) {
                if (topXUsed[x] === undefined) {
                    topXUsed[x] = 1;
                } else {
                    topXUsed[x]++;
                }
            }
        }
    }
    // sort
    let sortable = [];
    for (const x in topXUsed) {
        sortable.push([x, topXUsed[x]]);
    }
    sortable.sort(function (a, b) {
        return b[1] - a[1];
    });
    let topX = {};
    for (let i = 0; i < 8; i++) {
        topX[sortable[i][0]] = sortable[i][1];
    }
    return topX;
}

function getTopOsUsedByDevType(data){
    let topOsUsed = {};
    let devTypes = Object.keys(getNbDevById(data, 'DevType'));
    for (const devType of devTypes) {
        let topXUsed = Object.entries(getTopXUsedByDevType(data, devType, 'OpSysProfessionaluse'));
        topOsUsed[devType] = topXUsed.slice(0, 3);
    }
    return topOsUsed;
}

function getCountListByLanguage(data, language) {
    let countList = [];
    for (const job of data) {
        for (const language of job[0]){


        }
    }
    return countList;

}

// ====================
function getXOSCounts(data,field) {
    const macOSCounts = [];

    // Parcours des données
    for (const category in data) {
        const osList = data[category];
        const macOSCount = osList.find(([os, count]) => os === field);
        macOSCounts.push(macOSCount ? macOSCount[1] : 0);
    }

    return macOSCounts;
}

function createEntry(data, field) {
    return {
        label: field,
        backgroundColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
        data: getXOSCounts(data, field)
    };
}

function createEntries(data1,data2) {
    const entries = [];
    const fields = Object.keys(getNbDevByFieldSplitted(data1, 'OpSysProfessionaluse'));
    console.log(fields);
    for (const field of fields) {
        entries.push(createEntry(data2, field));
    }
    return entries;
}


// Code à exécuter en cas de succès de la requête
request.done(function (output) {
    const dataContinent = getDevDataByContinent(output, 'Europe');
    let allDevTypes = Object.keys(getNbDevById(output, 'DevType'));
    let dataTop = getTopOsUsedByDevType(dataContinent);

    const data_ = createEntries(dataContinent,dataTop);
    createSelectData('selector', 'selectorWork', Object.keys(getNbDevById(output, 'DevType')));

    //console.log(dataTop);
    // console.log(data_);

    let chart = loadStackedBarChart(allDevTypes, data_, "TEST",'barChartTopOS');
});

// Code à exécuter en cas d'échec de la requête
request.fail(function (httpError) {
    let server_msg = httpError.responseText;
    let code = httpError.status;
    let code_label = httpError.statusText;
    alert("Erreur " + code + " (" + code_label + ") : " + server_msg);
});