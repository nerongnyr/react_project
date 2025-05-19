const express = require('express');
const db = require('../db');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const session = require('express-session');
const router = express.Router();
const JWT_KEY = "show_me_the_money";

router.post("/", async(req, res) => {
    let { userId, pwd } = req.body;
    try {
        let query = "SELECT * FROM tbl_user WHERE USERID = ?";
        let [user] = await db.query(query, [userId])
        let result = {}
        
        if(user.length > 0) {
            let isMatch = await bcrypt.compare(pwd, user[0].pwd)

            if(isMatch) {
                // jwt 토큰 생성
                let payload = {
                    userId : user[0].userId,
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
  
  module.exports = router;