/*
Fonction  retournant le nombre de developpeur par niveau d'étude
@param data: données JSON
@return nbDevByEdu: dictionnaire avec le nombre de développeurs par niveau d'étude
 */
 import {convertCurrencyToEuro} from "./functions-libs.js";

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
        let yearsExperience = developer['EdLevel'];
        if (yearsExperience === edu) {
            if (developer['CompTotal'] !== 'NA') {
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

export function computeMeanSalaryEtu(data, edu) {
    let devSalaries = getNbDevSalaryByEdu(data, edu);
    let sum = 0;
    for (const devSalary of devSalaries) {
        sum += parseFloat(devSalary);
    }
    return (sum / devSalaries.length).toFixed(2);
}
