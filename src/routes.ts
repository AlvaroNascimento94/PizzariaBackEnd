import {Router, Response, Request} from 'express'

const router = Router()

router.get("/test",(req:Request,res:Response)=>{
    return res.json({message: "API is working!"})
})

export  {router}