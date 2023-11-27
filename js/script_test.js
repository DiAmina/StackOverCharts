let request = $.ajax({
    type: "GET",
    url: "../data/survey_results.json",
});

let currencyRequest = $.ajax({
    type: "GET",
    url: "../data/currencies.json"
});

let currencyData = [];

currencyRequest.done(function (output) {
    currencyData = output;
});

function getnFirst(data, n) {
    let first = [];
    for (let i = 0; i < n; i++) {
        first.push(data[i]);
    }
    return first;
}

// Fonction renvoyant le nombre de personnes travaillant en remote
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

// Fonction renvoyant les données d'un pays
function countryData(data, country) {
    let countryData = [];
    for (const element of data) {
        if (element['Country'] === country) {
            countryData.push(element);
        }
    }
    return countryData;
}

// Fonction intégrant les données dans un élément HTML
function integrateData(data, id, detail= "") {
    let element = document.getElementById(id);
    if (detail === "") {
        element.innerHTML = data;
    } else {
        element.innerHTML = data + " " + detail;
    }
}

// Fonction renvoyant la liste des pays distincts avec le nombre de personnes
function getCountryList(data) {
    let countriesUsers = {};
    for (const element of data) {
        if (countriesUsers[element['Country']] === undefined) {
            countriesUsers[element['Country']] = 1;
        } else {
            countriesUsers[element['Country']] += 1;
        }
    }
    return Object.entries(countriesUsers).sort((a, b) => b[1] - a[1])
}

// Fonction renvoyant l'ensemble des Currency utilisées (distinctes)
function getCurrencyList(data) {
    let currency = [];
    for (const element of data) {
        if (!currency.includes(element['Currency'])) {
            currency.push(element['Currency']);
        }
    }
    // stocker dans un fichier txt avec saut de ligne
    return currency;
}

// Fonction renvoyant l'equivalent currency en EUR
function getConversionEur(data, currency) {
    for (const element of data) {
        if (element['name'] === currency) {
            return element['EquivEuro'];
        }
    }
}

function loadBarChart(x, y, label) {
    let ctx = document.getElementById('barChart').getContext('2d');
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

// Code à exécuter en cas de succès de la requête
request.done(function (output) {
    let remote = remoteWork(output);
    integrateData(remote[0],'remotecount');
    integrateData(remote[1].toFixed(2),'remotepercentage',"%");
    integrateData(output.length,'totalcount');
    console.log(getConversionEur(currencyData, "IDR\tIndonesian rupiah"));
    let countries = getCountryList(output);
    let chart = loadBarChart(countries.map(x => x[0]), countries.map(x => x[1]), "Nombre de personnes");
});

// Code à exécuter en cas d'échec de la requête
request.fail(function (http_error) {
    let server_msg = http_error.responseText;
    let code = http_error.status;
    let code_label = http_error.statusText;
    alert("Erreur "+code+" ("+code_label+") : "  + server_msg);
});