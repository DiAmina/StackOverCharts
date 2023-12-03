
import {
    getDevDataByContinent, getNbDevSalaryByExpYears,
    computeMeanSalary, getDevByCountry,
    getNbDevByExpYears, loadLineChart,
    loadBarChart, loadPieChart,
} from './function-libs.js';


let request = $.ajax({
    type: "GET",
    url: "../data/survey_results.json",
});

function getMeanSalaryByExpYears(data) {
    let nbDevByExpYears = getNbDevByExpYears(data)
    let meanSalaryByExpYears = {};
    for (let yearsExp of Object.keys(nbDevByExpYears)) {
        meanSalaryByExpYears[yearsExp] = computeMeanSalary(data, yearsExp);
        if (!isNaN(meanSalaryByExpYears[yearsExp])) {
            meanSalaryByExpYears[yearsExp] = parseFloat(meanSalaryByExpYears[yearsExp]);
        }

        if (meanSalaryByExpYears[yearsExp] === 0) {
            meanSalaryByExpYears[yearsExp] = NaN;
        }
    }

    meanSalaryByExpYears["50"] = meanSalaryByExpYears["More than 50 years"];
    delete meanSalaryByExpYears["More than 50 years"];

    meanSalaryByExpYears["0"] = meanSalaryByExpYears["Less than 1 year"];
    delete meanSalaryByExpYears["Less than 1 year"];

    return meanSalaryByExpYears;
}


// Code à exécuter en cas de succès de la requête
request.done(function (output) {
    const data = getDevDataByContinent(output,"Europe");
    const data2 = getDevByCountry(data,"France")

    console.log("NB DEV BY EXP : ");
    console.log(getNbDevSalaryByExpYears(data,"42"));

    console.log("MEAN SALARY BY EXP : ");
    console.log(getMeanSalaryByExpYears(data2));
});

// Code à exécuter en cas d'échec de la requête
request.fail(function (http_error) {
    let server_msg = http_error.responseText;
    let code = http_error.status;
    let code_label = http_error.statusText;
    alert("Erreur "+code+" ("+code_label+") : "  + server_msg);
});