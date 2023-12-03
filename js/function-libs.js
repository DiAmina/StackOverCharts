// This file contains all the functions that are used in the project
let currencyRequest = $.ajax({
    type: "GET",
    url: "../data/currencies.json"
});

let currencyData = [];
currencyRequest.done(function (output) {
    currencyData = output;
});

const EUROPE_COUNTRIES = [
    "Germany",
    "United Kingdom of Great Britain and Northern Ireland",
    "France",
    "Poland",
    "Netherlands",
    "Italy",
    "Spain",
    "Switzerland",
    "Belgium",
    "Portugal",
    "Ireland",
];

const AMERICA_COUNTRIES = [
    "United States of America",
    "Canada"
];

// LINE CHART
export function loadLineChart(x, y, label,id) {
    let ctx = document.getElementById(id).getContext('2d');
    return new Chart(ctx, {
        type: 'line',
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


// PIE CHART
export function loadPieChart(x, y, label,id) {
    let ctx = document.getElementById(id).getContext('2d');
    return new Chart(ctx, {
        type: 'pie',
        data: {
            labels: x,
            datasets: [{
                label: label,
                data: y,
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)'
                ],
                hoverOffset: 4
            }]
        }
    })
}

// BAR CHART
export function loadBarChart(x, y, label,id) {
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

// Fonction renvoyant la liste des pays distincts avec le nombre de personnes
export function getCountryList(data) {
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

// Fonction intégrant les données dans un élément HTML
export function integrateData(data, id, detail= "") {
    let element = document.getElementById(id);
    if (detail === "") {
        element.innerHTML = data;
    } else {
        element.innerHTML = data + " " + detail;
    }
}

export function getDevDataByContinent(data, country) {
    let devData = [];
    if (country === 'Europe') {
        for (const developer of data) {
            if (EUROPE_COUNTRIES.includes(developer['Country'])) {
                devData.push(developer);
            }
        }
    } else if (country === 'America') {
        for (const developer of data) {
            if (AMERICA_COUNTRIES.includes(developer['Country'])) {
                devData.push(developer);
            }
        }
    } else {
        throw new Error("Country not found");
    }
    return devData;
}

export function getDevByCountry(data, country) {
    let devData = [];
    for (const developer of data) {
        if (developer['Country'] === country) {
            devData.push(developer);
        }
    }
    return devData;
}

export function convertCurrencyToEuro(currency) {
    for (const currencyDataElement of currencyData) {
        if (currencyDataElement['name'] === currency) {
            return currencyDataElement['EquivEuro'];
        }
    }
}

/*
    * Fonction renvoyant le nombre de développeurs par années d'expérience
    * @param data: données JSON
    * @return nbDevByExpYears: dictionnaire avec le nombre de développeurs par années d'expérience
 */
export function getNbDevByExpYears(data) {
    let nbDevByExpYears = {};
    for (const developer of data) {
        let yearExperience = developer['YearsCodePro'];
        if (yearExperience === 'NA') {
            continue;
        }

        if (nbDevByExpYears[yearExperience] === undefined) {
            nbDevByExpYears[yearExperience] = 1;
        } else {
            nbDevByExpYears[yearExperience] += 1;
        }
    }
    return nbDevByExpYears;
}

/*
    * Fonction renvoyant les salaires des développeurs par années d'expérience
    * Attention: Sachant que certains développeur n'ont pas renseigné leur salaire (CompTotal = 'NA'), il il ne sera pas pris en compte
    * @param data: données JSON
    * @param yearsExp: années d'expérience
    * @return devSalaries: liste des salaires des développeurs par années d'expérience
 */
export function getNbDevSalaryByExpYears(data, yearsExp){
    let devSalaries = []
    for (const developer of data) {
        let yearsExperience = developer['YearsCodePro'];
        if (yearsExperience === yearsExp) {
            if (!isNaN(parseFloat(developer['CompTotal']))) {
                const currency = developer['Currency'];
                if (currency !== 'EUR European Euro') {
                    devSalaries.push((parseInt(developer['CompTotal']) * convertCurrencyToEuro(currency)).toFixed(2));
                } else {
                    devSalaries.push(parseFloat(developer['CompTotal']).toFixed(2));
                }
            }
        }
    }
    return devSalaries;
}

export function computeMeanSalary(data, yearsExp) {
    let salaries = getNbDevSalaryByExpYears(data, yearsExp);

    let sum = 0;
    for (const salary of salaries) {
        sum += parseFloat(salary);
    }

    let result = (sum / salaries.length).toFixed(2)

    return result === 'NaN' ? NaN : result;
}



