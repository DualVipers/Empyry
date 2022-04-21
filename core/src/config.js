import logger from "./logger.js";

export default class {
    #data = {};

    read(location) {
        const sublocations = location.split(".");

        let data = this.#data;

        for (const sublocation in sublocations) {
            data = data[sublocation];

            if (typeof data == "undefined") {
                logger.warn(`Could Not Find Value For ${location}`);
                return undefined;
            }
        }

        logger.debug(`Found Value ${data} For ${location}`);

        return data;
    }

    write(changes) {
        let newData = {};
        for (const change in changes) {
            const sublocations = change.location.split(".");

            let data = change.value;

            for (let i = sublocations.length - 2; i >= 0; i--) {
                data = { [sublocations[i]]: data };
            }

            newData = { ...newData, ...data };

            logger.info(`Set ${change.location} To ${change.value}`);
        }

        this.#data = { ...this.#data, ...newData };
    }

    constructor(data) {
        this.#data = data;
    }
}
