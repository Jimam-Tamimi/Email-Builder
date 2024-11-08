import axios from "axios";
export const getAllCountries = async () => {
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}admin/crm/countries/`);
        return res?.data
    } catch (error: any) {
    }
    return []
}

export const getAllLanguages = async () => {
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}admin/crm/languages/`);
        return res?.data
    } catch (error: any) {
    }
    return []
}
export const getAllPositions = async () => {
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}admin/crm/positions/`);
        return res?.data
    } catch (error: any) {
    }
    return []
}
export const getAllSectors = async () => {
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}admin/crm/sectors/`);
        return res?.data
    } catch (error: any) {
    }
    return []
}
export const getAllSources = async () => {
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}admin/crm/sources/`);
        return res?.data
    } catch (error: any) {
    }
    return []
}



export const downloadCSVFile = (csvData:any, filename:string) => {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' }); // Create a Blob object
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob); // Generate a temporary URL
    downloadLink.download = filename; // Set the filename
    downloadLink.click(); // Simulate a click to download the file
    URL.revokeObjectURL(downloadLink.href); // Revoke the temporary URL
};

export const sIfPlural = (array:any) =>  array?.length > 1?'s':'';