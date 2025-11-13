
import jwt from "jsonwebtoken"

const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                error: "Token is missing :(",
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = decoded;
        // console.log("user:",req.user)
        next();
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            error: "Internal server error",
        })
    }

}

export default auth;