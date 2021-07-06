let regex=/^\S{1,40}@gmail\.com$/;

exports.validateEmail = (email) => 
{
    return regex.test(email);
}