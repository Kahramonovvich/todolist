export function formatPhone(phone) {
    return phone.replace(
        /^\+?998(\d{2})(\d{3})(\d{2})(\d{2})$/,
        '+998 $1 $2 $3 $4'
    );
};