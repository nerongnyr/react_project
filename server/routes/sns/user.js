const express = require('express');
const db = require('../../db');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const session = require('express-session');
const authMiddleware  = require('../../auth');
const router = express.Router();
const JWT_KEY = "show_me_the_money";
const multer  = require('multer')
const path = require('path');
const fs = require('fs');

router.post("/", async(req, res) => {
    let { userid, password } = req.body;
    try {
        let query = "SELECT * FROM USERS WHERE USERID = ?";
        let [user] = await db.query(query, [userid])
        let result = {}
        
        if(user.length > 0) {
            let isMatch = await bcrypt.compare(password, user[0].password)

            if(isMatch) {
                // jwt 토큰 생성
                let payload = {
                    id : user[0].id,
                    userid : user[0].userid,
                    username : user[0].username,
                    userPhone : user[0].phone,
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
    let { userid, username, email, password, bio, phone, addr } = req.body;
    try {
        let hashPwd = await bcrypt.hash(password, 10)
        let query = "INSERT INTO USERS VALUES (NULL, ?, ?, ?, ?, NULL, ?, ?, ?, NOW(), NOW())";
            await db.query(query, [userid, username, email, hashPwd, bio, phone, addr])
        res.json({ result : 'success' })
    } catch(err) {
        console.log("에러 발생!", err)
        res.status(500).send("Server Error")
    }
})

router.get('/me', authMiddleware, async (req, res) => {
    const userid = req.user.userid;
  
    try {
      // 사용자 기본 정보
      const [[user]] = await db.query(
        'SELECT * FROM USERS WHERE USERID = ?',
        [userid]
      );
  
      if (!user) {
        return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
      }
  
      // 팔로워 / 팔로잉 수
      const [[followerCount]] = await db.query(
        'SELECT COUNT(*) AS count FROM FOLLOWS WHERE FOLLOWEE_ID = ?',
        [userid]
      );
      const [[followingCount]] = await db.query(
        'SELECT COUNT(*) AS count FROM FOLLOWS WHERE FOLLOWER_ID = ?',
        [userid]
      );
  
      // 사용자의 게시물 목록 + 대표 이미지
      const [posts] = await db.query(
        `SELECT P.ID, MIN(IMG.IMG_PATH) AS thumbnail
         FROM POST P
         LEFT JOIN POST_IMG IMG ON P.ID = IMG.POST_ID
         WHERE P.USER_ID = ?
         GROUP BY P.ID
         ORDER BY P.ID DESC`,
        [userid]
      );
  
      res.json({
        user: {
            id: user.id,
            userid: user.userid,
            username: user.username,
            bio: user.bio,
            profileImg: user.profile_img,
            followerCount: followerCount.count,
            followingCount: followingCount.count
        },
        posts: posts.map(p => ({
          id: p.ID,
          thumbnail: p.thumbnail
        }))
      });
    } catch (err) {
      console.error('오류:', err);
      res.status(500).json({ message: '서버 오류' });
    }
});  

router.get("/", authMiddleware, async (req, res) => {
    let { userid } = req.query;
  
    if (!userid && req.user?.userid) {
      userid = req.user.userid;
    }
  
    try {
      let sql = "SELECT * FROM USERS";
  
      const [list] = await db.query(sql, userid ? [userid] : []);
  
      res.json({
        message: "result",
        list: list,
      });
    } catch (err) {
      console.error("에러 발생!", err);
      res.status(500).send("Server Error");
    }
});

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    }
  });
  
const upload = multer({ storage });

router.post('/profile', upload.single('profileImg'), (req, res) => {
    const userid = req.body.userid;
    const bio = req.body.bio;
    const file = req.file;
  
    if (!userid) return res.json({ success: false });
  
    const imgUrl = file ? "/uploads/" + file.filename : null;
    let sql, params;
  
    if (imgUrl) {
      sql = "UPDATE USERS SET PROFILE_IMG = ?, BIO = ? WHERE USERID = ?";
      params = [imgUrl, bio, userid];
    } else {
      sql = "UPDATE USERS SET BIO = ? WHERE USERID = ?";
      params = [bio, userid];
    }
  
    db.query(sql, params, (err, result) => {
      if (err) {
        console.error(err);
        return res.json({ success: false });
      }
      res.json({ success: true, imgUrl });
    });
});  

// 내가 북마크한 게시물들
router.get('/bookmarks', authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const [rows] = await db.query(`
      SELECT P.*, 
        (SELECT IMG_PATH FROM POST_IMG WHERE POST_ID = P.ID LIMIT 1) AS thumbnail
    FROM BOOKMARK B
    JOIN POST P ON B.POST_ID = P.ID
    WHERE B.USER_ID = ?
    ORDER BY B.CREATED_AT DESC
    `, [userId]);
  
    res.json({ posts: rows });
});

router.get('/unread-count', authMiddleware, async (req, res) => {
    const userId = req.user.id;
  
    const [rows] = await db.query(
      'SELECT COUNT(*) AS count FROM NOTIFICATIONS WHERE user_id = ? AND is_read = FALSE',
      [userId]
    );
  
    res.json({ count: rows[0].count });
});  

// 전체 알림 조회
router.get('/notifications', authMiddleware, async (req, res) => {
    const userId = req.user.userid;
  
    const [rows] = await db.query(`
      SELECT N.*, U.username AS senderUsername, U.profile_img AS senderProfile
    FROM NOTIFICATIONS N
    JOIN USERS U ON N.from_userid = U.userid
    WHERE N.user_id = ?
    ORDER BY N.cdatetime DESC
    `, [userId]);
  
    res.json({ notifications: rows });
  });
  
// 읽음 처리
router.post('/notifications/mark-all-read', authMiddleware, async (req, res) => {
    const userId = req.user.id;
    await db.query(`UPDATE NOTIFICATIONS SET is_read = 1 WHERE user_id = ?`, [userId]);
    res.json({ success: true });
});

router.get('/user/:userid', async (req, res) => {
  const { userid } = req.params;

  try {
    const [rows] = await db.query(`
      SELECT P.ID AS id, P.CONTENT, P.CDATETIME,
             PI.IMG_PATH AS img
      FROM POST P
      LEFT JOIN POST_IMG PI ON P.ID = PI.POST_ID AND PI.THUMBNAIL = 1
      WHERE P.USER_ID = ?
      ORDER BY P.CDATETIME DESC
    `, [userid]);

    res.json({ posts: rows });
  } catch (err) {
    console.error('유저 게시물 조회 실패:', err);
    res.status(500).json({ error: '서버 오류' });
  }
});

router.get('/:userid', authMiddleware, async (req, res) => {
  const { userid } = req.params;
  const currentUserId = req.user.userid;

  try {
    const [rows] = await db.query(`
      SELECT userid, username, profile_img, bio
      FROM USERS
      WHERE userid = ?
    `, [userid]);

    if (rows.length === 0) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    const user = rows[0];

    // 팔로우 여부
    const [followRows] = await db.query(`
      SELECT 1 FROM FOLLOWS
      WHERE FOLLOWER_ID = ? AND FOLLOWEE_ID = ?
      LIMIT 1
    `, [currentUserId, userid]);
    const isFollowing = followRows.length > 0;

    // 팔로워 수
    const [followerCountRows] = await db.query(`
      SELECT COUNT(*) AS count FROM FOLLOWS WHERE FOLLOWEE_ID = ?
    `, [userid]);

    // 팔로잉 수
    const [followingCountRows] = await db.query(`
      SELECT COUNT(*) AS count FROM FOLLOWS WHERE FOLLOWER_ID = ?
    `, [userid]);

    res.json({
      ...user,
      isFollowing,
      followerCount: followerCountRows[0].count,
      followingCount: followingCountRows[0].count
    });

  } catch (err) {
    console.error('유저 정보 조회 실패:', err);
    res.status(500).json({ error: '서버 오류' });
  }
});

router.post('/follow/toggle', authMiddleware, async (req, res) => {
  const followerId = req.user.userid;
  const { targetUserId } = req.body;

  if (!targetUserId) return res.status(400).json({ error: '대상 유저 없음' });

  try {
    const [rows] = await db.query(`
      SELECT 1 FROM FOLLOWS WHERE FOLLOWER_ID = ? AND FOLLOWEE_ID = ?
    `, [followerId, targetUserId]);

    let isFollowing = false;

    if (rows.length > 0) {
      // 언팔로우
      await db.query(`
        DELETE FROM FOLLOWS WHERE FOLLOWER_ID = ? AND FOLLOWEE_ID = ?
      `, [followerId, targetUserId]);
    } else {
      // 팔로우
      await db.query(`
        INSERT INTO FOLLOWS (FOLLOWER_ID, FOLLOWEE_ID) VALUES (?, ?)
      `, [followerId, targetUserId]);
      isFollowing = true;
    }

    res.json({ isFollowing });
  } catch (err) {
    console.error('팔로우 토글 실패:', err);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 팔로워 목록 조회
router.get('/:id/followers', authMiddleware, async (req, res) => {
  const targetId = req.params.id;
  const myId = req.user.userid;

  try {
    const [rows] = await db.query(`
      SELECT 
        u.userid, u.username, u.profile_img AS profileImg,
        EXISTS (
          SELECT 1 FROM FOLLOWS f2 WHERE f2.follower_id = ? AND f2.followee_id = u.userid
        ) AS isFollowing
      FROM FOLLOWS f
      JOIN USERS u ON f.follower_id = u.userid
      WHERE f.followee_id = ?
    `, [myId, targetId]);

    res.json({ list: rows });
  } catch (err) {
    console.error("팔로워 목록 오류:", err);
    res.status(500).json({ error: '팔로워 목록 조회 실패' });
  }
});

// 팔로잉 목록 조회
router.get('/:id/followings', authMiddleware, async (req, res) => {
  const targetId = req.params.id;
  const myId = req.user.userid;

  try {
    const [rows] = await db.query(`
      SELECT 
        u.userid, u.username, u.profile_img AS profileImg,
        EXISTS (
          SELECT 1 FROM FOLLOWS f2 WHERE f2.follower_id = ? AND f2.followee_id = u.userid
        ) AS isFollowing
      FROM FOLLOWS f
      JOIN USERS u ON f.followee_id = u.userid
      WHERE f.follower_id = ?
    `, [myId, targetId]);

    res.json({ list: rows });
  } catch (err) {
    console.error("팔로잉 목록 오류:", err);
    res.status(500).json({ error: '팔로잉 목록 조회 실패' });
  }
});
  
module.exports = router;