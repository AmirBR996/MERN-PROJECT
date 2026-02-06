// hash password
import bcrypt from "bcryptjs"
export const hashPassword = async(password)=>{
    try{
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password,salt); 
    }catch(error){
        console.log(error)
    }
};
export const comparePassword = async(password,hash)=>{
    try{
        return await bcrypt.compare(password,hash)

    }catch(error){
        console.log(error)
    }
}