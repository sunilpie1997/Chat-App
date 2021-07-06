let regex=/^\S{1,40}@gmail\.com$/;

const validateEmail = (email) => 
{
    return regex.test(email);
}

export default validateEmail;