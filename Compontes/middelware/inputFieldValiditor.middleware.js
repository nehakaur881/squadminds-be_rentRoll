const { validationResult } = require('express-validator');

const InputFieldValidate = async (req , res , next)=>{
    const errors  = validationResult();
    if(!errors.isEmpty()){
        const mainError = errors.array().map(err =>({[err.param ] : err.msg}));

        return res.status(422).json({
            error : mainError
        })
    }
    next()
}
module.exports = InputFieldValidate;