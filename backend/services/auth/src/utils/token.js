import jwt from "jsonwebtoken"

const generateToken = (id)=>{
   try {
      let token = jwt.sign({id},process.env.JWT_SECERET,{expiresIn:'7d'});
      return token;
   } catch (error) {
      console.log(`token error ${error}`)
   }
}

export default generateToken;