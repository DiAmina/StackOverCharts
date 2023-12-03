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



