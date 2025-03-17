export const fetchWithAuth = async (
    route: string,
    options: RequestInit = {}
): Promise<any> => {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL + route;
    const token = typeof window !== 'undefined' ? localStorage.getItem('x-access-token') : null;

    const headers = new Headers(options.headers || {});

    if (token) {
        headers.set('x-access-token', token);
    }

    const updatedOptions: RequestInit = {
        ...options,
        headers,
    };

    const response = await fetch(url, updatedOptions);

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
        throw new Error(data.error);
    }

    return data.data;
};
