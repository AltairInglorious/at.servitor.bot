import * as https from "https";

export const getUrlData = (url: string): Promise<any> => {
    "use strict";
    return new Promise((resolve, reject) => {
        https
            .get(url, (resp) => {
                let data = '';

                // Chunks of data
                resp.on('data', (chunk) => {
                    data += chunk;
                });

                resp.on('end', () => {
                    resolve(JSON.parse(data));
                });
            })
            .on("error", (err) => {
                reject(err);
            });
    });
};
