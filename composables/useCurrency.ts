export const useCurrency = () => {
    const formatCurrency = (value: number | null | undefined): string => {
        if (value == null) return '$0.00';

        const useFourDecimals = value > 0 && value < 0.01;

        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: useFourDecimals ? 4 : 2,
            maximumFractionDigits: useFourDecimals ? 4 : 2
        }).format(value);
    };

    return { formatCurrency };
};
