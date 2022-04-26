import hasha from "hasha";

export default async (file) => {
    return hasha.async(file);
};
