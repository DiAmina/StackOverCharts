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

/**
 * Fonction renvoyant le nombre de développeurs ayant travaillé avec un field donné
 * @param data
 * @param field
 * @returns {{}}
 */
export function getNbDevByFieldSplitted(data, field) {
    let nbDevByField = {};
    for (const developer of data) {
        let devsFields = developer[field].split(';');
        if (devsFields[0] === 'NA' || devsFields[0] === '' || devsFields.includes('NA')) {
            continue;
        }
        for (const devField of devsFields) {
            if (nbDevByField[devField] === undefined) {
                nbDevByField[devField] = 1;
            } else {
                nbDevByField[devField] += 1;
            }
        }
    }
    return nbDevByField;
}

// Eviter les duplications
export function getValues(developer, devSalaries) {
    if (!isNaN(parseFloat(developer['CompTotal']))) {
        let currency = developer['Currency'];
        let value;
        if (currency !== 'EUR European Euro') {
            value = (parseInt(developer['CompTotal']) * convertCurrencyToEuro(currency)).toFixed(2);
        } else {
            value = parseFloat(developer['CompTotal']).toFixed(2);
        }

        // On ne prend pas en compte les salaires supérieurs à 1 000 000 € par an (abbération)
        if (value < 1000000 && value > 1000) {
            devSalaries.push(value);
        }
    }
}

// POLAR AREA CHART
export function loadPolarAreaChart(x, y, label, id) {
    let ctx = document.getElementById(id).getContext('2d');
    console.log("OK !");
    return new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: x,
            datasets: [{
                label: label,
                data: y,
                backgroundColor: [
                    'rgba(16,57,147,0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 205, 86,0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(255,64,64,0.6)',
                ],
                hoverOffset: 4
            }]
        }
    })
}

// LINE CHART WITH NaN data
export function loadLineChartNaN(x, y, label, id) {
    let ctx = document.getElementById(id).getContext('2d');
    const skipped = (ctx, value) => ctx.p0.skip || ctx.p1.skip ? value : undefined;
    const down = (ctx, value) => ctx.p0.parsed.y > ctx.p1.parsed.y ? value : undefined;
    const genericOptions = {
        fill: false,
        interaction: {
            intersect: false
        },
        radius: 4,
    };
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
export function loadPieChart(x, y, label, id) {
    let ctx = document.getElementById(id).getContext('2d');
    return new Chart(ctx, {
        type: 'pie',
        data: {
            labels: x,
            datasets: [{
                label: label,
                data: y,
                backgroundColor: [
                    'rgb(247,230,40)',
                    'rgb(255,146,0)',
                    'rgb(211,82,22)',
                    'rgb(255,74,64)',
                    'rgb(227,71,121)',
                    'rgb(229,11,0)',
                    'rgb(204,14,214)',
                    'rgb(29,177,182)',
                ],
                hoverOffset: 4
            }]
        }
    })
}

export function scatterChart(x, y, label, id) {
    let ctx = document.getElementById(id).getContext('2d');

    return new Chart(ctx, {
        type: 'scatter',
        data: {
            labels: x,
            datasets: [{
                label: label,
                data: y,
                backgroundColor:
                    'rgba(255, 159, 64, 1)'
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'category',
                    position: 'bottom'
                }
            }
        }
    });
}

// DOUGHNUT CHART
export function loadDoughnutChart(x, y, label, id) {
    let ctx = document.getElementById(id).getContext('2d');
    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: x,
            datasets: [{
                label: label,
                data: y,
                backgroundColor: [
                    'rgba(231,130,103,0.8)',
                    'rgba(236,221,83,0.8)',
                    'rgb(137,232,86,0.8)',
                    'rgb(90,236,201,0.8)',
                    'rgb(98,121,239,0.8)',
                    'rgb(205,94,236,0.8)',
                    'rgb(234,96,216,0.8)',
                    'rgb(234,95,116,0.8)',
                ],
                hoverOffset: 4
            }]
        }
    })
}

// BAR CHART
export function loadBarChart(x, y, label, id) {
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
export function integrateData(data, id, detail = "") {
    let element = document.getElementById(id);
    if (detail === "") {
        element.innerHTML = data;
    } else {
        element.innerHTML = data + " " + detail;
    }
}

/**
 * Crée un selecteur HTML
 * @param parentId - ID du parent
 * @param id - ID du selecteur
 * @param selectFromId - ID du selecteur à partir duquel on crée le selecteur
 */
export function createSelect(parentId, id, selectFromId) {
    const divSelect = document.getElementById(parentId);
    const parentSelected = document.getElementById(selectFromId).value;
    const select = document.createElement('select');
    select.id = id;
    select.className = "form-select form-select-sm mb-2";
    divSelect.appendChild(select);

    let titleOption = document.createElement('option');
    titleOption.value = "Séléctionner un pays";
    titleOption.text = "Séléctionner un pays";
    titleOption.disabled = true;
    select.appendChild(titleOption);

    let voidOption = document.createElement('option');
    voidOption.value = "none";
    voidOption.text = "";
    select.appendChild(voidOption);

    switch (parentSelected) {
        case 'Europe':
            for (const country of EUROPE_COUNTRIES) {
                const option = document.createElement('option');
                option.value = country;
                option.text = country;
                select.appendChild(option);
            }
            break;
        case 'Amérique':
            for (const country of AMERICA_COUNTRIES) {
                const option = document.createElement('option');
                option.value = country;
                option.text = country;
                select.appendChild(option);
            }
            break;
        default:
            throw new Error("Country not found");
    }
}

export function createSelectData(parentId, id, data, title, voidOptionEnable = true) {
    const divSelect = document.getElementById(parentId);
    const select = document.createElement('select');
    select.id = id;
    select.className = "form-select form-select-sm mb-2";
    divSelect.appendChild(select);

    let titleOption = document.createElement('option');
    titleOption.value = title;
    titleOption.text = title;
    titleOption.disabled = true;
    select.appendChild(titleOption);

    if (voidOptionEnable) {
        let voidOption = document.createElement('option');
        voidOption.value = "none";
        voidOption.text = "";
        voidOption.selected = true;
        select.appendChild(voidOption);
    }

    for (const element of data) {
        const option = document.createElement('option');
        option.value = element;
        option.text = element;
        select.appendChild(option);
    }
}

export function updateSelectParented(selectParent, selectChild) {
    const select = document.getElementById(selectParent);
    let selectedVal = select.options[select.selectedIndex].value;
    const selectChildElement = document.getElementById(selectChild);
    selectChildElement.innerHTML = "";

    let voidOption = document.createElement('option');
    voidOption.value = "none";
    voidOption.text = "";
    selectChildElement.appendChild(voidOption);

    switch (selectedVal) {
        case 'Europe':
            for (const country of EUROPE_COUNTRIES) {
                const option = document.createElement('option');
                option.value = country;
                option.text = country;
                selectChildElement.appendChild(option);
            }
            break;
        case 'Amérique':
            for (const country of AMERICA_COUNTRIES) {
                const option = document.createElement('option');
                option.value = country;
                option.text = country;
                selectChildElement.appendChild(option);
            }
            break;
        default:
            throw new Error("Country not found");
    }
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
 * Renvoie les données des développeurs en fonction de l'année d'expérience donnée
 * @param data - Données JSON
 * @param years - Année d'expérience
 * @returns {*[]} - Liste des développeurs en format JSON
 */
export function getDevByExpYEars(data, years) {
    let devData = [];
    for (const developer of data) {
        if (developer['YearsCodePro'] === years.toString()) {
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
 * Renvoie le nombre de développeurs par id donnée
 * @param data - Données JSON
 * @param attribut - Attribut à prendre en compte
 * @returns {{}} - Nombre de développeurs par id [id : nbDev]
 */
export function getNbDevById(data, attribut) {
    let results = {};
    for (const developer of data) {
        let label = developer[attribut];
        if (label === 'NA') {
            continue;
        }

        if (results[label] === undefined) {
            results[label] = 1;
        } else {
            results[label] += 1;
        }
    }
    return results;
}

/**
 * Fonction renvoyant le salaire des développeurs ayant travaillé avec un field donné
 * @param data - données des développeurs
 * @param value - valeur du sélecteur
 * @param field - champ à analyser
 * @returns {*[]} - tableau des salaires
 */
export function getDevSalaryByFieldSplitted(data, value, field) {
    let devSalaries = [];
    for (const developer of data) {
        let devsFields = developer[field].split(';');
        if (devsFields[0] === 'NA' || devsFields[0] === '' || devsFields.includes('NA')) {
            continue;
        }
        if (devsFields.includes(value)) {
            getValues(developer, devSalaries);
        }
    }
    return devSalaries;
}

/**
 * Renvoie les salaires des développeurs de l'attribut donné
 *
 * Attention : Sachant que certain développeur n'ont pas renseigné leur salaire (CompTotal = 'NA'),
 * ils ne seront pas pris en compte
 * @param data - Données JSON
 * @param value - valeur de l'attribut
 * @param attribut - Attribut à prendre en compte
 * @returns {*[]} - Liste des salaires
 */
export function getDevSalaryById(data, value, attribut) {
    let devSalaries = []
    for (const developer of data) {
        let attributData = developer[attribut];
        if (attributData === value) {
            getValues(developer, devSalaries);
        }
    }
    return devSalaries;
}

/**
 * Renvoie le salaire moyen des développeurs en fonction de l'attribut donné
 * @param data - Données JSON
 * @param value - Valeur de l'attribut
 * @param field - Attribut à prendre en compte
 * @returns {number|string} - Salaire moyen
 */
export function computeMeanSalary(data, value, field) {
    let salaries = getDevSalaryById(data, value, field);
    let sum = 0;
    for (const salary of salaries) {
        sum += parseFloat(salary);
    }

    let result = parseFloat((sum / salaries.length).toFixed(2));
    return isNaN(result) ? NaN : result;
}
