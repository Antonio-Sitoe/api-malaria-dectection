"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deathPreditian = deathPreditian;
const data_processing_1 = require("@/training/data-processing");
const ss = __importStar(require("simple-statistics"));
const get_processed_malaria_data_1 = require("@/training/get-processed-malaria-data");
async function deathPreditian(app) {
    app.post('/death-preditian', async (req, reply) => {
        const { region, country, year = new Date().getFullYear(), } = req.query;
        try {
            const malariaDataframe = await (0, data_processing_1.processData)('src/training/dataset.csv');
            const malariaLista = await (0, get_processed_malaria_data_1.getProcessedMalariaData)(malariaDataframe, region, country);
            const linearModelCases = ss.linearRegression(malariaLista.map((item) => [item.year, item.cases]));
            const linearModelDeaths = ss.linearRegression(malariaLista.map((item) => [item.year, item.deaths]));
            const predictedCases = ss.linearRegressionLine(linearModelCases)(year);
            const predictedDeaths = ss.linearRegressionLine(linearModelDeaths)(year);
            return reply.status(200).send({
                data: {
                    deaths: {
                        qty: predictedDeaths.toFixed(),
                        message: `Previsão de Mortes para o ano (${year}): ${predictedDeaths.toFixed()}`,
                    },
                    cases: {
                        qty: predictedCases.toFixed(),
                        message: `Previsão de Casos para o ano (${year}): ${predictedCases.toFixed()}`,
                    },
                    data: malariaLista,
                },
            });
        }
        catch (error) {
            return reply.status(400).send({
                error,
            });
        }
    });
}
