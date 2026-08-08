import jwt from "jsonwebtoken"

const generateToken = (userId)=>{
   try {
      const accessToken = jwt.sign(
         {id:userId},
         process.env.JWT_ACCESS_SECRET,
         {expiresIn: '15m'}
      )

      const refreshToken = jwt.sign(
         {id:userId},
         process.env.JWT_REFRESH_SECRET,
         {expiresIn : '7d'}
      )

      return { accessToken, refreshToken};
   } catch (error) {
      console.log(`token error ${error}`)
   }
}

export default generateToken;