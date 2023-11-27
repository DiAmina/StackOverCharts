// Envoi de la requête vers le fichier de données JSON
let request = $.ajax({
    type: "GET",
    url: "../data/survey_results.json"
});

EUROPE_COUNTRIES = {
    0: "Germany",
    1: "United Kingdom of Great Britain and Northern Ireland",
    3: "France",
    4: "Poland",
    5: "Netherlands",
    6: "Italy",
    7: "Spain",
    8: "Switzerland",
    9: "Belgium",
    10: "Portugal",
    11: "Ireland",
};

AMERICA_COUNTRIES = {
    0: "United States of America",
    1: "Canada",
};


// Fonction pour obtenir les salaires moyens en fonction de l'expérience
function getMeanSalaryByExp(data, continent, pays) {
    const meanSalaries = {};
    const uniqueWorkExp = new Set();

    // Filtrer les données par continent ou par pays
    data = pays
        ? data.filter(element => element['Country'] === pays) // Filtrer par pays
        : data.filter(element => Object.values(EUROPE_COUNTRIES).includes(element['Country']) || Object.values(AMERICA_COUNTRIES).includes(element['Country'])); // Filtrer par continent

    for (const element of data) {
        const workExp = parseInt(element['WorkExp']);
        const salary = parseInt(element['CompTotal']);
        //
        if (!isNaN(workExp) && !isNaN(salary)) {
            uniqueWorkExp.add(workExp);

            if (meanSalaries[workExp] === undefined) {
                meanSalaries[workExp] = {totalSalaires: 0, count: 0};
            }
            meanSalaries[workExp].totalSalaires += Math.trunc(salary);
            meanSalaries[workExp].count += 1;
            console.log(`Travail Expérience : ${workExp}, Salaire : ${Math.trunc(salary)}`);
        }
    }

    const distinctWorkExp = Array.from(uniqueWorkExp);
    // Calculer la moyenne pour chaque niveau d'expérience
    Object.keys(meanSalaries).forEach(workExp => {
        //condition pour éviter la division par 0
        if (meanSalaries[workExp].count !== 0) {
            meanSalaries[workExp] = Math.round(meanSalaries[workExp].totalSalaires / meanSalaries[workExp].count);
        } else {
            meanSalaries[workExp] = 0;
        }
    });
     return meanSalaries;
}

// Code à exécuter en cas de succès de la requête
request.done(function (output) {
    let meanSalaries = getMeanSalaryByExp(output);
     meanSalaries = getMeanSalaryByExp(output,"" , "");
    console.log("Salaire moyen:",meanSalaries);

    // Mettez ici le reste de votre code qui utilise meanSalaries si nécessaire
});

// Code à exécuter en cas d'échec de la requête
request.fail(function (http_error) {
    let server_msg = http_error.responseText;
    let code = http_error.status;
    let code_label = http_error.statusText;
    alert("Erreur " + code + " (" + code_label + ") : " + server_msg);
});
