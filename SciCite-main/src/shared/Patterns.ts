export const emailPattern = {
    value: new RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$', 'ig'),
    message: ''
};

export const phonePattern = {
    value: new RegExp('^[+]?[0-9]{11}$'),
    message: ''
};
