const express = require('express');
const db = require('../../db');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const session = require('express-session');
const router = express.Router();
const JWT_KEY = "show_me_the_money";
const multer  = require('multer')

router.post("/", async(req, res) => {
    let { email, pwd } = req.body;
    try {
        let query = "SELECT * FROM tbl_member WHERE email = ?";
        let [user] = await db.query(query, [email])
        let result = {}
        
        if(user.length > 0) {
            let isMatch = await bcrypt.compare(pwd, user[0].pwd)

            if(isMatch) {
                // jwt 토큰 생성
                let payload = {
                    email : user[0].email,
                    userName : user[0].userName,
                    userPhone : user[0].phone,
                    userStatus : user[0].status
                }
                const token = jwt.sign(payload, JWT_KEY, {expiresIn : '1h'});
                console.log(token);
                result = {
                    message : "로그인 성공!",
                    success : true,
                    token : token
                }
            } else {
                result = {
                    success : false,
                    message : "아이디 확인하셈"
                }
            }
        } else {
            result = {
                message : "비밀번호 확인하셈"
            }
        }
      res.json({ result })
    } catch(err) {
      console.log("에러 발생!")
      res.status(500).send("Server Error")
    }
  })

router.post("/join", async(req, res) => {
    let { email, pwd, userName, addr, phone, birth, intro } = req.body;
    try {
        let hashPwd = await bcrypt.hash(pwd, 10)
        let query = "INSERT INTO TBL_MEMBER VALUES (?, ?, ?, ?, ?, ?, NULL, NOW(), NOW(), ?)";
        let [user] = await db.query(query, [email, hashPwd, userName, addr, phone, birth, intro])
        let result = {}
        res.json({ result })
    } catch(err) {
        console.log("에러 발생!")
        res.status(500).send("Server Error")
    }
  })

router.get("/", async (req, res) => {
    let { email } = req.query;
    try{
        let sql = "SELECT * FROM TBL_MEMBER";
        if(email) {
            sql += " WHERE email = '" + email + "'";
        }
        let [list] =  await db.query(sql);
        res.json({
            message : "result",
            list : list,
        });
    }catch(err){
        console.log("에러 발생!");
        res.status(500).send("Server Error");
    }
})

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    }
  });
  
const upload = multer({ storage });

router.post('/profile', upload.single('profileImg'), (req, res) => {
  
    const email = req.body.email;
    const file = req.file;
  
    if (!file || !email) return res.json({ success: false });
  
    const imgUrl = "/uploads/" + file.filename;
    const sql = "UPDATE TBL_MEMBER SET PROFILEIMG = ? WHERE EMAIL = ?";
  
    db.query(sql, [imgUrl, email], (err, result) => {
      if (err) {
        console.error(err);
        return res.json({ success: false });
      }
      res.json({ success: true, imgUrl });
    });
});

module.exports = router;