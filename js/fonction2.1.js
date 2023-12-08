import {convertCurrencyToEuro} from "./functions-libs.js";

/**
 * Fonction renvoyant le nombre de développeurs en fonction des plateformes de cloud avec lesquelles il a travaillé
 * @param data - Données JSON
 * @returns {{}} - Nombre de développeurs par plateformes de cloud [cloud: nbDev]
 */

export function getNbDevByCloud(data) {
    let nbDevByCloud = {};
    for (const developer of data) {
        let cloud = developer['PlatformHaveWorkedWith'].split(';')[0];
        if (cloud === 'NA') {
            continue;
        }

        if (nbDevByCloud[cloud] === undefined) {
            nbDevByCloud[cloud] = 1;
        } else {
            nbDevByCloud[cloud] += 1;
        }
    }
    return nbDevByCloud;
}

/**
 * Fonction renvoyant les salaire moyens des développeurs par plateformes de cloud
 * @param data - Données JSON
 * @param cloud - Plateforme de cloud
 * @returns {[]} - Liste des salaires des développeurs par plateformes de cloud
 */

export function getNbDevSalaryByCloud(data, cloud){
    let devSalaries = [];
    for (const developer of data) {
        let cloudPlatform = developer['PlatformHaveWorkedWith'];
        if (cloudPlatform === cloud) {
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

export function computeMeanSalaryCloud(data, cloud) {
    let devSalaries = getNbDevSalaryByCloud(data, cloud);
    let sum = 0;
    for (const devSalary of devSalaries) {
        sum += parseFloat(devSalary);
    }
    return (sum / devSalaries.length).toFixed(2);
}
    