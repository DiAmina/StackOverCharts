// This file contains all the functions that are used in the project
let currencyRequest = $.ajax({
    type: "GET",
    url: "../data/currencies.json"
});

let currencyData = [];
currencyRequest.done(function (output) {
    currencyData = output;
});

// Liste des pays d'Europe
export const EUROPE_COUNTRIES = [
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

// Liste des pays d'Amérique
export const AMERICA_COUNTRIES = [
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

// LINE CHART LINE SEGMENT STYLING
const skipped = (ctx, value) => ctx.p0.skip || ctx.p1.skip ? value : undefined;
const down = (ctx, value) => ctx.p0.parsed.y > ctx.p1.parsed.y ? value : undefined;
const genericOptions = {
    fill: false,
    interaction: {
        intersect: false
    },
    radius: 4,
};

// LINE CHART WITH NaN data
export function loadLineChartNaN(x, y, label,id) {
    let ctx = document.getElementById(id).getContext('2d');
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: x,
            datasets: [{
                label: label,
                data: y,
                borderColor: 'rgb(75, 192, 192)',
                segment: {
                    borderColor: ctx => skipped(ctx, 'rgb(0,0,0,0.2)') || down(ctx, 'rgb(192,75,75)'),
                    borderDash: ctx => skipped(ctx, [6, 6]),
                },
                spanGaps: true
            }]
        },
        options: genericOptions
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

/**
 * Met à jour un graphique donné
 * @param chart - Graphique
 * @param x - Données en abscisse
 * @param y - Données en ordonnée
 */
export function updateChart(chart, x, y) {
    chart.data.labels = x;
    chart.data.datasets[0].data = y;
    chart.update();
}

/**
 * Renvoie le nombre de développeurs par pays
 * @return {Array}: liste des pays avec le nombre de développeurs
 * @param data
 */
export function getNbDevByCountry(data) {
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

/**
 * Intègre les données dans une balise HTML
 * @param data
 * @param {string} id - ID de la balise HTML
 * @param {string} detail - Détail à ajouter à la fin de la donnée
 */
export function integrateData(data, id, detail= "") {
    let element = document.getElementById(id);
    if (detail === "") {
        element.innerHTML = data;
    } else {
        element.innerHTML = data + " " + detail;
    }
}

export function createSelect(options,id,parentId) {
    const divSelect = document.getElementById(parentId);
    const select = document.createElement('select');
    select.id = id;
    select.className = "form-select form-select-sm";
    divSelect.appendChild(select);

    for (const option of options) {
        const opt = document.createElement('option');
        opt.value = option;
        opt.innerHTML = option;
        select.appendChild(opt);
    }
}

export function createBr(parentId) {
    const divSelect = document.getElementById(parentId);
    const br = document.createElement('br');
    divSelect.appendChild(br);
}

/**
 * Retourne les données des développeurs en fonction du continent
 * @param data - Données JSON
 * @param country - Continent
 * @returns {*[]} : liste des développeurs
 */
export function getDevDataByContinent(data, country) {
    let devData = [];
    if (country === 'Europe') {
        for (const developer of data) {
            if (EUROPE_COUNTRIES.includes(developer['Country'])) {
                devData.push(developer);
            }
        }
    } else if (country === 'Amérique') {
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

/**
 * Renvoie les données des développeurs en fonction du pays
 * @param data - Données JSON du continent
 * @param country - Pays
 * @returns {*[]} : liste des développeurs
 */
export function getDevByCountry(data, country) {
    let devData = [];
    for (const developer of data) {
        if (developer['Country'] === country) {
            devData.push(developer);
        }
    }
    return devData;
}

/**
 * Convertit une devise en euro
 * @param currency - Devise
 * @returns {*} - Valeur en euro
 */
export function convertCurrencyToEuro(currency) {
    for (const currencyDataElement of currencyData) {
        if (currencyDataElement['name'] === currency) {
            return currencyDataElement['EquivEuro'];
        }
    }
}

/**
 * Renvoie le nombre de développeurs par années d'expérience
 * @param data
 * @returns {{}}
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

/**
 * Renvoie les salaires des développeurs de l'année d'expérience donnée
 *
 * Attention: Sachant que certains développeur n'ont pas renseigné leur salaire (CompTotal = 'NA'),
 * ils ne seront pas pris en compte
 * @param data - Données JSON
 * @param yearExp - Année d'expérience
 * @returns {*[]} - Liste des salaires
 */
export function getDevSalaryByExpYears(data, yearExp){
    let devSalaries = []
    for (const developer of data) {
        let yearsExperience = developer['YearsCodePro'];
        if (yearsExperience === yearExp) {
            if (!isNaN(parseFloat(developer['CompTotal']))) {
                let currency = developer['Currency'];
                let value = null;
                if (currency !== 'EUR European Euro') {
                    value = (parseInt(developer['CompTotal']) * convertCurrencyToEuro(currency)).toFixed(2);
                } else {
                    value = parseFloat(developer['CompTotal']).toFixed(2);
                }

                // On ne prend pas en compte les salaires supérieurs à 1 000 000 € par an (abbération)
                if (value < 1000000) {
                    devSalaries.push(value);
                }
            }
        }
    }
    return devSalaries;
}

/**
 * Renvoie le salaire moyen des développeurs en fonction de leur année d'expérience
 * @param data - Données JSON
 * @param yearsExp - Année d'expérience
 * @returns {number|string} - Salaire moyen
 */
export function computeMeanSalary(data, yearsExp) {
    let salaries = getDevSalaryByExpYears(data, yearsExp);

    let sum = 0;
    for (const salary of salaries) {
        sum += parseFloat(salary);
    }

    let result = (sum / salaries.length).toFixed(2)

    return result === 'NaN' ? NaN : result;
}

/**
 * Renvoie le salaire le plus petit et le plus grand
 * @param data - Données JSON
 * @returns {number[]} - [Salaire minimum, Salaire maximum]
 */
export function minMaxSalary(data) {
    let min = Math.min(...data);
    let max = Math.max(...data);
    return [min, max];
}
