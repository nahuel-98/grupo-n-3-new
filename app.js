const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const bodyParser = require("body-parser");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const {swaggerSpec} = require('./config/swagger')
const multer = require('multer');
require('dotenv').config()
const port = process.env.PORT || 3000


const indexRouter = require('./routes/index')

const app = express()
app.use(cors())


app.use(cors())
app.use(bodyParser.json());
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(swaggerSpec)))

//multer, service for uploading images
app.use(multer({
  dest: path.join(__dirname, 'public/uploads'),
  fileFilter: function (req, file, cb) {

      var filetypes = /svg|jpg|png|webp/;
      var mimetype = filetypes.test(file.mimetype);
      var extname = filetypes.test(path.extname(file.originalname).toLowerCase());

      if (mimetype && extname) {
          return cb(null, true);
      }
      cb("Error: File upload only supports the following filetypes - " + filetypes);
  },
  limits: {fileSize: 2000000},
}).single('image'));

app.use('/', indexRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = {
  server: app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Servidor funcionando en el puerto ${port}`)
  })
  
}