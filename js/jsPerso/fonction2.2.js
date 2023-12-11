import {
    convertCurrencyToEuro
} from "../functions-libs.js";

export function getNbDevByFramewordUsed(data) {
    let nbDevByFramework = {};
    for (const developer of data) {
        let labels = developer['WebframeHaveWorkedWith'].split(';');

        if (labels[0] === 'NA' || labels[0] === '' || labels.includes('NA')) {
            continue;
        }
        for (const label of labels) {
            if (nbDevByFramework[label] === undefined) {
                nbDevByFramework[label] = 1;
            } else {
                nbDevByFramework[label] += 1;
            }
        }
        return nbDevByFramework;
    }
}

    export function getNbDevSalaryByWebFrame(data, framework) {
        let devSalaries = [];
        for (const developer of data) {
            let framworkHaveUsed = developer['WebframeHaveWorkedWith'];
            if (framworkHaveUsed === framework) {
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

    export function computeMeanSalaryWebFrame(data, framework) {
        let devSalaries = getNbDevSalaryByWebFrame(data, framework);
        let sum = 0;
        for (const devSalary of devSalaries) {
            sum += parseFloat(devSalary);
        }
        return (sum / devSalaries.length).toFixed(2);
    }


