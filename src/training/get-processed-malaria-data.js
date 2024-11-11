"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProcessedMalariaData = getProcessedMalariaData;
exports.getProcessedMalariaList = getProcessedMalariaList;
const get_central_value_1 = require("./get-central-value");
const prepare_data_off_nullable_fields_1 = require("./prepare-data-off-nullable-fields");
async function getProcessedMalariaData(csvData, region, country) {
    let dfs = csvData;
    if (country) {
        const regionSeries = dfs['Country'];
        dfs = dfs.query(regionSeries.eq(country));
    }
    else if (region) {
        const regionSeries = dfs['WHO Region']; // Coluna de região
        dfs = dfs.query(regionSeries.eq(region));
    }
    dfs.$setColumnNames(['country', 'year', 'cases', 'deaths', 'region']);
    const malariaData = await (0, prepare_data_off_nullable_fields_1.fillMissingWithMean)(dfs);
    const malariaDataList = malariaData.values.map((row) => {
        return {
            country: String(row[0]),
            year: Number(row[1]),
            cases: (0, get_central_value_1.getCentralValue)(row[2]),
            deaths: (0, get_central_value_1.getCentralValue)(row[3]),
            region: String(row[4]),
        };
    });
    return malariaDataList;
}
async function getProcessedMalariaList(dfs) {
    dfs.$setColumnNames(['country', 'year', 'cases', 'deaths', 'region']);
    const malariaData = await (0, prepare_data_off_nullable_fields_1.fillMissingWithMean)(dfs);
    const malariaDataList = malariaData.values.map((row) => {
        const cases = (0, get_central_value_1.getCentralValue)(row[2]);
        const deaths = (0, get_central_value_1.getCentralValue)(row[3]);
        const riskLevel = cases > 20000 || deaths > 5000 ? 'Alto' : 'Baixo';
        return {
            country: String(row[0]),
            year: Number(row[1]),
            region: String(row[4]),
            cases,
            deaths,
            riskLevel,
        };
    });
    const target = 'riskLevel';
    const columns = malariaData.columns;
    malariaData.head().print();
    return {
        data: malariaDataList,
        columns,
        target,
    };
}
