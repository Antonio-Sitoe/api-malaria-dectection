"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const death_predition_1 = require("./routes/death-predition");
const death_risk_1 = require("./routes/death-risk");
const get_all_data_1 = require("./routes/get-all-data");
const app = (0, fastify_1.default)();
app.register(cors_1.default);
app.register(death_predition_1.deathPreditian);
app.register(death_risk_1.deathRisk);
app.register(get_all_data_1.getAllData);
app
    .listen({
    port: 3333,
})
    .then(() => {
    console.log('Server is Running on port http://localhost:3333');
});
