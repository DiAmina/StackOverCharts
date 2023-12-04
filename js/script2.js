import {convertCurrencyToEuro} from "./functions-libs.js";

/**
 * Fonction renvoyant le nombre de développeurs par niveau d'étude
 * @param data - Données JSON
 * @returns {{}} - Nombre de développeurs par niveau d'étude [edu: nbDev]
 */
export function getNbDevByEdu(data) {
     let nbDevByEdu = {};
     for (const developer of data) {
         let edu = developer['EdLevel'];
         if (edu === 'NA') {
             continue;
         }

         if (nbDevByEdu[edu] === undefined) {
             nbDevByEdu[edu] = 1;
         } else {
             nbDevByEdu[edu] += 1;
            }
     }
     return nbDevByEdu;
}

    /*
        * Fonction renvoyant les salaire moyens des développeurs par niveau d'étude
        * @param data: données JSON
        * @param edu: niveau d'étude
        * @return meanSalaryByEdu: dictionnaire avec le salaire moyen des développeurs par niveau d'étude

     */
export function getNbDevSalaryByEdu(data, edu){
    let devSalaries = [];
    for (const developer of data) {
        let eduLevel = developer['EdLevel'];
        if (eduLevel === edu) {
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

export function computeMeanSalaryEtu(data, edu) {
    let devSalaries = getNbDevSalaryByEdu(data, edu);
    let sum = 0;
    for (const devSalary of devSalaries) {
        sum += parseFloat(devSalary);
    }
    return (sum / devSalaries.length).toFixed(2);
}
