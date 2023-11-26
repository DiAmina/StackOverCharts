// Envoi de la requête vers le fichier de données JSON
let request = $.ajax({
    type: "GET",
    url: "../data/survey_results.json"
});

// Fonction de calcul de revenu moyen d'un professionnel en fonction de son nombre d'années d'expérience
function averageSalaryByExperience(data) {
    let averageSalary = [];
    for (let i = 0; i < data.length; i++) {
        let salary = data[i].CompTotal;
        let workExp = data[i].WorkExp;
        averageSalary.push(salary / workExp);
    }
    return averageSalary;
}

// Fonction récupérant les données pour une certaine expérience
function getWorkExp(data, anneExp) {
    let workExp = [];
    for (const element of data) {
        if (element['WorkExp'] === anneExp) {
            workExp.push(element);
        }
    }
    return workExp;
}

// Fonction récupérant les données pour un certain revenu
function getRevenu(data, compTotal) {
    let revenu = [];
    for (const element of data) {
        if (element['CompTotal'] === compTotal) {
            revenu.push(element);
        }
    }
    return revenu;
}

// Code à exécuter en cas de succès de la requête
request.done(function (output) {
    let averageSalaries = averageSalaryByExperience(output);
    let workExp = getWorkExp(output, 10);
    let revenu = getRevenu(output, 285000);

    console.log("Salaire moyen :", averageSalaries);
    console.log("Revenu :", revenu);
    console.log("Expérience de travail :", workExp);
});

// Code à exécuter en cas d'échec de la requête
request.fail(function (http_error) {
    let server_msg = http_error.responseText;
    let code = http_error.status;
    let code_label = http_error.statusText;
    alert("Erreur " + code + " (" + code_label + ") : " + server_msg);
});
