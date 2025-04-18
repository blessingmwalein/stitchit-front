// use date fomat in sample 12 April 2025

import { ref } from 'vue';

export const useDateFormat = () => {
    const formatDate = (date: Date) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
    };

    //fomate date string
    const formatDateString = (dateString: string) => {
        const date = new Date(dateString);
        return formatDate(date);
    };

    return {
        formatDate,
        formatDateString,
    };
};