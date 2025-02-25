export default function generateRandomString(length) { 
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    
    return Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
}

