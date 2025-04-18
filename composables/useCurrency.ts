export const useCurrency = () => {
    const formatCurrency = (value: number | null | undefined): string => {
        if (!value) return '$0.00';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(value);
    };

    return { formatCurrency };
};
