import { canvas } from "./canvas.js";
/**
 * Request the server to apply the specifed filter on the current canvas image
 * @param {string} filter the name of the filter
 * @param {object} params params with names and values meant for the specified filter
 */
export default async (filter, params = {}) => {
    const formData = await makeFormDataForFilter(filter, params);
    const blob = await requestFilter(formData);
    setBlobToCanvas(blob);
}

const makeFormDataForFilter = async (filterName, params) => {
    const blob = await canvas.getBlob();
    const formData = new FormData();
    formData.append('image', blob, 'image.png');
    formData.set("filter", filterName);
    for (const key in params) formData.set(key, params[key]);
    return formData;
}
/**
 * Make the canvas use the raw image data to display image
 * @param {Blob} blob the raw binary data 
 */
const setBlobToCanvas = (blob) => {
    const objectURL = URL.createObjectURL(blob);
    const image = new Image();
    image.src = objectURL;
    image.onload = () => {
        canvas.drawImage(image);
    }
}

async function requestFilter(formData) {
    try {
        const response = await fetch(
            'http://localhost:10000/filter',
            {
                method: "POST",
                body: formData,
            }
        );
        const blob = await response.blob()
        return blob;
    } catch (error) {
        console.error("Error uploading file:", error);
    }
}