const bcrypt = require('bcrypt')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
require('dotenv').config()


// dbEntry  for admin

exports.admin = async (req, res) => {
    const {email, password } = req.body;

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

// login 

exports.login = async (req, res) => {
    const { email, password } = req.body;

    console.log(email, password)

    if (!email || !password) {
        return res.status(401).json({
            success: false,
            message: "all field are required.."
        })
    }

    try {
        const data = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        console.log("start>>>>", data, "dattttttttttt")

        if (data.rows.length === 0) {
            return res.status(402).json({
                success: false,
                message: "User not register Please SignUp.."
            })
        }

        const user = data.rows[0];

        const matchPassword = await bcrypt.compare(password, user.password);

        if (!matchPassword) {
            return res.status(403).json({
                success: false,
                message: "Password incorrect"
            })
        }

        return res.status(200).json({
            success: true,
            message: "User Login successfully...",
            user: data.rows[0]
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            messege: "Please try again",
        })
    }

}


// forgotPassword
exports.sendotp = async (req, res) => {
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

        const resetLink = `http://localhost:5000/api/reset-password?token=${token}`;

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

// resetPassword
exports.resetPassword = async (req, res) => {

    const {newPassword}  = req.body;
    const token  = req.query.token;

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
        console.error( error);
        return res.status(500).json({
            success: false,
            message: "Password not reset please try again..."
        });
    }
}