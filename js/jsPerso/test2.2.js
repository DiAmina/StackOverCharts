import {
    computeMeanSalaryWebFrame,
    getNbDevByFramewordUsed,
    getNbDevSalaryByWebFrame,
} from "./fonction2.2.js";

//envoi de la requete ajax
let request = $.ajax({
    type: "GET",
    url: "../../data/survey_results.json"
});

function getMeanSalaryByWebFrame(data) {
    let nbDevByFramework = getNbDevByFramewordUsed(data);
    let meanSalaryByFramework = {};
    for (let framework of Object.keys(nbDevByFramework)) {
        meanSalaryByFramework[framework] = computeMeanSalaryWebFrame(data, framework);
        return meanSalaryByFramework;
    }
}
function minMaxSalary(data) {
    let min = Math.min(...data);
    let max = Math.max(...data);
    return [min, max];
}

// Code à exécuter en cas de succès de la requête
request.done(function (output) {
    const data = getNbDevByFramewordUsed(output);
    console.log("TEST");
    console.log(getNbDevByFramewordUsed(output));
    //console.log(getNbDevSalaryByWebFrame(output));
});

// Code à exécuter en cas d'échec de la requête
request.fail(function (httpError) {
    let server_msg = httpError.responseText;
    let code = httpError.status;
    let code_label = httpError.statusText;
    alert("Erreur " + code + " (" + code_label + ") : " + server_msg);
});
