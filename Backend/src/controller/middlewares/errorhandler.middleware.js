// middleware
export const errorHandler = (error ,  req ,res,next) => {
    console.log("error handler", error)
    res.status(500).json({
        message:error?.message || "Interval server error"
    })
}
