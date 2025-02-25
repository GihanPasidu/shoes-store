export const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return false;
    }
    // Add admin check
    const adminEmail = localStorage.getItem('adminEmail');
    return token && adminEmail === 'sahan@gmail.com';
};

export const adminCredentials = {
    email: 'sahan@gmail.com',
    password: '8080'
};