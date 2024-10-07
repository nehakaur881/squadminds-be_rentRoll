const bcrypt = require('bcrypt')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
require('dotenv').config()
const jwt = require('jsonwebtoken');


// >>>>>>>>>>>>>>>>> FOR ONLY ADMIN  <<<<<<<<<<<<<<<<<<<<<<<<
exports.admin = async (req, res) => {
    const { email, password } = req.body;

    console.log(req.body)

    if (!email || !password) {
        return res.status(401).json({
            success: false,
            messege: "All field are required...."
        })
    }



    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length > 0) {
        return res.status(400).json({
            success: false,
            message: "User Already Registered Please Login....."
        })
    }

    const hashPassword = await bcrypt.hash(password, 10);

    try {
        const query = 'INSERT INTO users (firstname, lastname, email, password  ) VALUES ($1,$2,$3,$4) RETURNING *';
        const value = [firstname, lastname, email, hashPassword];

        const result = await pool.query(query, value);
        // console.log(result, ">>>>>>>>>>>>>>>>>>>")

        return res.status(200).json({
            success: true,
            messege: "Admin created Successfully... ",
            data: result.rows[0]

        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            messege: "Please try again...?"
        })
    }

}

// >>>>>>>>>>>>>>>>> LOGIN <<<<<<<<<<<<<<<<<<<<<<<<
exports.login = async (req, res) => {
    const { email, password } = req.body;

    console.log(email, password);

    if (!email || !password) {
        return res.status(401).json({
            success: false,
            message: "All fields are required."
        });
    }

    try {
        const data = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        console.log("start>>>>", data, "dattttttttttt");

        if (data.rows.length === 0) {
            return res.status(402).json({
                success: false,
                message: "User not registered. Please sign up."
            });
        }

        const user = data.rows[0];

        const matchPassword = await bcrypt.compare(password, user.password);

        if (!matchPassword) {
            return res.status(403).json({
                success: false,
                message: "Password incorrect."
            });
        }


        const payload = {
            userId: user.id,
            email: user.email
        };


        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1m' });


        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: "User logged in successfully.",
            user: {
                id: user.id,
                email: user.email
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Please try again."
        });
    }
};

// >>>>>>>>>>>>>>>>> FORGOT PASSWORD <<<<<<<<<<<<<<<<<<<<<<<<
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    console.log("email", email);

    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid email"
        });
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // console.log(email, ">>>>>");


        const token = crypto.randomBytes(20).toString('hex');
        const tokenExpiry = new Date(Date.now() + 2 * 60 * 1000);



        await pool.query('UPDATE users SET token = $1, tokenexpire = $2 WHERE email = $3', [token, tokenExpiry, email]);

        const resetLink = `${process.env.API_URL}/api/reset-password?token=${token}`;

        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        });


        // email
        let info = await transporter.sendMail({
            from: `SquadMinds - by Kamlesh Gupta`,
            to: email,
            subject: 'Forgot Password Link',
            html: `<h1>Reset Password Link</h1> <p>Please click on link</p> <a href="${resetLink}">Reset Password</a>`
        });


        return res.status(200).json({
            success: true,
            message: "Password reset mail sent successfully"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Please try again"
        });
    }
};

// >>>>>>>>>>>>>>>>> RESET PASSWORD <<<<<<<<<<<<<<<<<<<<<<<<
exports.resetPassword = async (req, res) => {

    const { newPassword } = req.body;
    const token = req.query.token;

    if (!token || !newPassword) {
        return res.status(400).json({
            success: false,
            message: "all field are required."
        });
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE token = $1', [token]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "token expire"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await pool.query('UPDATE users SET password = $1, token = NULL WHERE token = $2', [hashedPassword, token]);

        return res.status(200).json({
            success: true,
            message: "Password  reset successfully."
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Password not reset please try again..."
        });
    }
}

// >>>>>>>>>>>>>>>>> ADD PROPERTIES <<<<<<<<<<<<<<<<<<<<<<<<
exports.addProperties = async (req, res) => {

    try {
        const { propertyname, zip, city, ward, location, street } = req.body;

        if (!propertyname || !zip || !city || !ward || !location || !street) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "please fill require fields"
            })
        }

        const query = 'INSERT INTO properties ( propertyname, zip, city, ward, location, street ) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *'
        const value = [propertyname, zip, city, ward, location, street,];
        const result = await pool.query(query, value);

        console.log("result:-", result)

        return res.status(200).json({
            status: 200,
            success: true,
            message: "Property add successfully..",
            data: result.rows[0]
        })


    } catch (error) {
        console.log(error);
        return res.status(501).json({
            status: 501,
            message: "somethings went wrong.....",
            message: error.message
        })
    }
}

// >>>>>>>>>>>>>>>>> FATCH PROPERTIES <<<<<<<<<<<<<<<<<<<<<<<<
exports.getProperties = async (req, res) => {
    try {
        const query = 'SELECT * FROM properties';
        const result = await pool.query(query);

        return res.status(200).json({
            status: 200,
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error(error);
        return res.status(501).json({
            status: 501,
            message: "Something went wrong.",
            error: error.message
        });
    }
};

// >>>>>>>>>>>>>>>>> UPDATE PROPERTIES <<<<<<<<<<<<<<<<<<<<<<<<
exports.updateProperties = async (req, res) => {
    const { propertyid } = req.params;
    const { propertyname, zip, city, ward, location, street } = req.body;

    try {
        const query = 'UPDATE properties SET propertyname = $1, zip = $2, city = $3, ward = $4, location = $5, street = $6 WHERE propertyid = $7 RETURNING *';
        const values = [propertyname, zip, city, ward, location, street, propertyid];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "Property not found"
            });
        }

        return res.status(200).json({
            status: 200,
            success: true,
            message: "Property updated successfully.",
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        return res.status(501).json({
            status: 501,
            message: "Something went wrong.",
            error: error.message
        });
    }
};

// >>>>>>>>>>>>>>>>> DELETE PROPERTIES <<<<<<<<<<<<<<<<<<<<<<<<
exports.deleteProperties = async (req, res) => {
    const { propertyid } = req.params;
    console.log(propertyid,">>>>>>>>>>>>>>")

    try {
        const query = 'DELETE FROM properties WHERE propertyid = $1 RETURNING *';
        const result = await pool.query(query, [propertyid]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "Property not found"
            });
        }

        return res.status(200).json({
            status: 200,
            success: true,
            message: "Property deleted successfully."
        });
    } catch (error) {
        console.error(error);
        return res.status(501).json({
            status: 501,
            message: "Something went wrong.",
            error: error.message
        });
    }
};
