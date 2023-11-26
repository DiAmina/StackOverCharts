// Envoi de la requête vers le fichier de données JSON
let request = $.ajax({
    type: "GET",
    url: "../data/survey_results.json"
});

// Fonction pour obtenir les salaires moyens en fonction de l'expérience
function getMeanSalaryByExp(data, continent, pays) {
    const meanSalaries = {};
    const uniqueWorkExp = new Set();

    // Filtrer les données par continent ou par pays
    data = pays
        ? data.filter(element => element['Continent'] === continent && element['Country'] === pays)
        : data.filter(element => element['Continent'] === continent);

    for (const element of data) {
        const workExp = parseInt(element['WorkExp']);
        const salary = parseFloat(element['CompTotal']);

        console.log(`Travail Expérience : ${workExp}, Salaire : ${salary}`);
        //
        if (!isNaN(workExp) && !isNaN(salary)) {
            uniqueWorkExp.add(workExp);

            if (meanSalaries[workExp] === undefined) {
                meanSalaries[workExp] = {totalSalaires: 0, count: 0};
            }
            meanSalaries[workExp].totalSalaires += salary;
            meanSalaries[workExp].count += 1;
        }
    }

    const distinctWorkExp = Array.from(uniqueWorkExp);
    // Calculer la moyenne pour chaque niveau d'expérience
    Object.keys(meanSalaries).forEach(workExp => {
        //condition pour éviter la division par 0
        if (meanSalaries[workExp].count !== 0) {
            meanSalaries[workExp] = meanSalaries[workExp].totalSalaires / meanSalaries[workExp].count;
        } else {
            meanSalaries[workExp] = 0;
        }
    });
    return meanSalaries;
}

// Code à exécuter en cas de succès de la requête
request.done(function (output) {
    let meanSalaries = getMeanSalaryByExp(output);
    console.log("Salaire moyen :", meanSalaries);
    // Mettez ici le reste de votre code qui utilise meanSalaries si nécessaire
});

// Code à exécuter en cas d'échec de la requête
request.fail(function (http_error) {
    let server_msg = http_error.responseText;
    let code = http_error.status;
    let code_label = http_error.statusText;
    alert("Erreur " + code + " (" + code_label + ") : " + server_msg);
});
