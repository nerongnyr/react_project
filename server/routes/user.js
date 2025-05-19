const express = require('express');
const db = require('../db');
const bcrypt = require('bcrypt')
const session = require('express-session');
const router = express.Router();

router.post("/", async(req, res) => {
    let { userId, pwd } = req.body;
    try {
        let query = "SELECT * FROM tbl_user WHERE USERID = ?";
        let [user] = await db.query(query, [userId])
        let result = {}
        
        if(user.length > 0) {
            let isMatch = await bcrypt.compare(pwd, user[0].pwd)

            if(isMatch) {
                // 세션 값 저장
                req.session.user = {
                    sessionId : user[0].userId,
                    sessionName : user[0].userName,
                    sessionPhone : user[0].phone,
                    sessionStatus : user[0].status
                }
                console.log(req.session)
                result = {
                message : "로그인 성공!",
                userId : user[0].userId
                }
            } else {
                result = {
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

  router.get("/info", (req, res) => {
    if(req.session.user) {
        res.json({
            isLogin : true,
            user : req.session.user
        })
    } else {
        res.json({
            isLogin : false
        })
    }
  })

  router.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if(err) {
            console.log("세션 삭제 안됨")
            res.status(500).send("로그아웃 실패!")
        } else {
            res.clearCookie("connect.sid")
            res.json({
                message : "로그아웃 되샸음"
            })
        }
    })
  })

  router.post("/join", async(req, res) => {
    let { userId, pwd, name, addr, phone } = req.body;
    try {
        let hashPwd = await bcrypt.hash(pwd, 10)
        let query = "INSERT INTO TBL_USER VALUES (?, ?, ?, ?, ?, NOW(), NOW(), 'C')";
        let [user] = await db.query(query, [userId, hashPwd, name, addr, phone])
        let result = {}
        res.json({ result })
    } catch(err) {
        console.log("에러 발생!")
        res.status(500).send("Server Error")
    }
  })
  
  module.exports = router;