"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deathRisk = deathRisk;
const decision_tree_1 = __importDefault(require("decision-tree"));
const get_processed_malaria_data_1 = require("@/training/get-processed-malaria-data");
const data_processing_1 = require("@/training/data-processing");
async function deathRisk(app) {
    app.post('/death-risk', async (req, reply) => {
        try {
            const { data: testData } = req.body;
            const malariaDataframe = await (0, data_processing_1.processData)('src/training/dataset.csv');
            const { columns, data, target } = await (0, get_processed_malaria_data_1.getProcessedMalariaList)(malariaDataframe);
            const dt = new decision_tree_1.default(data, target, columns);
            function predictRisk(data) {
                return dt.predict(data);
            }
            const predictedRisk = predictRisk(testData);
            console.log(`O nível de risco previsto é: ${predictedRisk}`);
            return reply.status(200).send({
                message: `O nível de risco previsto é: ${predictedRisk}`,
                predictedRisk,
                testData,
                data: data,
            });
        }
        catch (error) {
            console.log(error);
            return reply.status(400).send({
                error,
            });
        }
    });
}
