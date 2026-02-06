import jwt from 'jsonwebtoken'
export const generateToken =(payload)=>{
    return jwt.sign(payload,'hdf@hjfjd', {expiresIn: '7d'}
        
    )

}
export const verifyToken = (token) =>{
    return jwt.verify(token , "hdf@hjfjd")
}
