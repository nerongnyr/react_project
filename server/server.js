const express = require('express')
const db = require('./db')
const productRouter = require('./routes/product')
const userRouter = require('./routes/user')
const loginRouter = require('./routes/login')
const studentRouter = require('./routes/student')
const boardRouter = require('./routes/board')
const feedRouter = require('./routes/feed')
const memberRouter = require('./routes/sns/member')
const snsFeedRouter = require('./routes/sns/feed')
const snsPostRouter = require('./routes/sns/post')
const snsUserRouter = require('./routes/sns/user')
const snsChatRouter = require('./routes/sns/chat')
const cors = require('cors')  
var session = require('express-session')
const path = require('path')

const app = express()
app.use(express.json());
app.use(cors({
  origin : ["http://localhost:3000", "http://localhost:3001"],
  credentials : true
})) 

app.use(session({
  secret: 'test1234',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    httpOnly : false ,
    secure : false ,
    maxAge : 1000 * 60 * 30
  }
}))

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use("/product", productRouter);
app.use("/user", userRouter);
app.use("/login", loginRouter);
app.use("/student", studentRouter);
app.use("/board", boardRouter);
app.use("/feed", feedRouter);
app.use("/member", memberRouter);
app.use("/sns-user", snsUserRouter);
app.use("/sns-feed", snsFeedRouter);
app.use("/sns-post", snsPostRouter);
app.use("/sns-chat", snsChatRouter);

app.listen(3005, () => {
  console.log("서버 실행 중!")
})

const { startWebSocketServer } = require('./routes/sns/webSoket');
startWebSocketServer(app);