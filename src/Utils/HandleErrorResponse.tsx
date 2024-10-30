export const handleErrorResponse = async (response: Response, data: any): Promise<string> => {
    if (!response.ok) {
        const result = await response.json();
        return result.message || data || 'An error occurred. Please try again later.';
    }
    return '';
};