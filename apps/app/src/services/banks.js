const API_URL = process.env.REACT_APP_API_URL;

const bankServices = {
    // Collecter les logos de banks
    // GET /api/banks
    getBankLogos: async () => {
        const resp = await fetch(`${API_URL}/api/banks`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!resp.ok) {
            throw new Error(`Failed to load bank logos: ${resp.status}`);
        }

        const data = await resp.json();
        return data;
    }
};

export default bankServices;