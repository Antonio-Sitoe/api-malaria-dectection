"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllData = getAllData;
const data_processing_1 = require("@/training/data-processing");
const get_central_value_1 = require("@/training/get-central-value");
async function getAllData(app) {
    app.get('/get-all-data', async (_, reply) => {
        const malariaDataframe = await (0, data_processing_1.processData)('src/training/dataset.csv');
        const malariaDataList = malariaDataframe?.values.map((row) => {
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
        return reply.status(200).send({ data: malariaDataList });
    });
}
