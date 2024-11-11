"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fillMissingWithMean = fillMissingWithMean;
async function fillMissingWithMean(df) {
    df.columns.forEach((column) => {
        if (typeof df[column]?.values[0] === 'number') {
            const columnMean = df[column].mean();
            df[column] = df[column].fillna(columnMean);
        }
    });
    return df;
}
