const express = require('express');
const db = require('../../db');
const authMiddleware  = require('../../auth');
const router = express.Router();
const multer  = require('multer')
const fs = require('fs');
const path = require('path');
const { sendNotification } = require('./webSoket')

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    }
  });
  
const upload = multer({ storage });
  
// 게시물 등록
router.post(
  "/",
  upload.fields([
    { name: "images", maxCount: 10 },
  ]),
  async (req, res) => {
    const { userId, content } = req.body;
    const files = req.files["images"] || [];

    console.log("userId:", userId); 
    console.log("content:", content);
  
    try {
      // 1. 피드 정보 저장
      const query = "INSERT INTO POST VALUES (NULL, ?, ?, NOW(), NOW(), NULL)";
      const result = await db.query(query, [userId, content]);
      const postdId = result[0].insertId; // insertId를 가져오려면 필요
  
      // 2. 파일이 있다면 처리 
      for (let i = 0; i < files.length; i++) {
        const file = files[i]; 
        const imgPath = '/uploads/' + file.filename;
        const imgName = file.originalname;
        const thumbnail = (i === 0) ? 1 : 0; 
      
        const fileQuery = "INSERT INTO POST_IMG VALUES (NULL, ?, ?, ?, ?)";
        await db.query(fileQuery, [postdId, imgName, imgPath, thumbnail]);
      }
  
      res.json({
        message: "등록 성공!",
        result: result[0]
      });
    } catch (err) {
      console.error("에러 발생!", err);
      res.status(500).send("Server Error");
    }
});  

// 홈 화면
router.get("/", async (req, res) => {
    try{
      let sql = `
        SELECT P.ID AS id, P.USER_ID as userid, P.CONTENT,
              DATE_FORMAT(P.CDATETIME, '%Y-%m-%dT%H:%i:%s') AS cdatetime,
              I.IMG_PATH AS img_path, I.THUMBNAIL,
              U.USERNAME, U.PROFILE_IMG AS profile_img
        FROM POST P
        INNER JOIN POST_IMG I ON P.ID = I.POST_ID
        LEFT JOIN USERS U ON P.USER_ID = U.USERID
        ORDER BY P.CDATETIME DESC
      `;    
        let [rows] = await db.query(sql);

        let postsMap = new Map();
    
        rows.forEach(row => {
          console.log("ROW:", row);

          if (!postsMap.has(row.id)) {
            postsMap.set(row.id, {
              id: row.id,
              userid: row.userid,
              username: row.username,
              userProfile: row.profile_img,
              content: row.CONTENT,
              cdatetime: row.cdatetime,
              images: row.img_path ? [row.img_path] : [],
              likes: 0,
              comments: []
            });
          } else {
            postsMap.get(row.id).images.push(row.img_path);
          }
        });
    
        const [commentRows] = await db.query("SELECT * FROM COMMENT");
        
        commentRows.forEach(comment => {
          if (postsMap.has(comment.POST_ID)) {
            postsMap.get(comment.POST_ID).comments.push({
              id: comment.COMMENT_ID,
              userid: comment.USERID,
              content: comment.CONTENT
            });
          }
        });
        
        const list = Array.from(postsMap.values());
        res.json({ message: "result", list });
    }catch(err){
        console.log("에러 발생!", err);
        res.status(500).json({ error: "Server Error" });
    }
})

// 좋아요 기능
router.post('/:postId/like', authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.userid || req.user.userId || req.user.id;

  if (!userId) return res.status(400).json({ error: '유저 ID 없음' });

  try {
    const [rows] = await db.query(
      `SELECT * FROM LIKES WHERE USER_ID = ? AND POST_ID = ?`,
      [userId, postId]
    );

    if (rows.length > 0) {
      // 좋아요 해제
      await db.query(
        `DELETE FROM LIKES WHERE USER_ID = ? AND POST_ID = ? `,
        [userId, postId]
      );
      res.json({ status: 'unliked' });
    } else {
      // 좋아요 추가
      await db.query(
        `INSERT IGNORE INTO LIKES VALUES (NULL, ?, ?, NOW())`,
        [userId, postId]
      );

       // 게시물 작성자 ID 확인
      const [[post]] = await db.query(`SELECT USER_ID FROM POST WHERE ID = ?`, [postId]);
      const targetUserId = post.USER_ID;

      // 본인에게는 알림 보내지 않음
      if (targetUserId !== userId) {
        // 사용자 정보
        const [[fromUser]] = await db.query(`SELECT USERNAME, PROFILE_IMG FROM USERS WHERE USERID = ?`, [userId]);

        // 알림 저장
        await db.query(`
          INSERT INTO NOTIFICATIONS (user_id, from_userid, type, target_id, cdatetime)
          VALUES (?, ?, 'like', ?, NOW())
        `, [targetUserId, userId, postId]);

        // 실시간 전송
        sendNotification(targetUserId, {
          type: 'like',
          from_userid: userId,
          senderUsername: fromUser.USERNAME,
          senderProfile: fromUser.PROFILE_IMG,
          target_id: postId,
          cdatetime: new Date()
        });
      }

      res.json({ status: 'liked' });
    }
  } catch (err) {
    console.error("좋아요 처리 중 오류:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// 좋아요 여부 확인
router.get('/:postId/liked', authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.userid || req.user.id;

  try {
    const [rows] = await db.query(
      `SELECT 1 FROM LIKES WHERE USER_ID = ? AND POST_ID = ? LIMIT 1`,
      [userId, postId]
    );
    res.json({ liked: rows.length > 0 });
  } catch (err) {
    console.error('좋아요 여부 확인 실패:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// 좋아요 개수 가져오기
router.get('/:postId/likes-count', async (req, res) => {
  const { postId } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT COUNT(*) AS count FROM LIKES WHERE POST_ID = ?`,
      [postId]
    );
    res.json({ count: rows[0].count });
  } catch (err) {
    console.error("좋아요 개수 가져오기 실패:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// 사용자 검색
router.get('/search-users', authMiddleware, async (req, res) => {
  const { query } = req.query;
  const userId = req.user.userid || req.user.id;

  if (!query || query.trim() === '') {
    return res.status(400).json({ error: '검색어가 없습니다.' });
  }

  try {
    // 1. 검색 기록 저장
    await db.query(
      `REPLACE INTO SEARCH_HISTORY VALUES (NULL, ?, ?, NOW())`,
      [userId, query]
    );

    // 2. 사용자 검색
    const [users] = await db.query(`
      SELECT  
          USERID AS userid,
          USERNAME AS username,
          PROFILE_IMG AS avatar
      FROM USERS
      WHERE USERID LIKE ? OR USERNAME LIKE ?
      LIMIT 20
    `, [`%${query}%`, `%${query}%`]);

    res.json(users);
  } catch (err) {
    console.error("사용자 검색 오류:", err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// 검색 기록
router.get('/search-history', authMiddleware, async (req, res) => {
  const userId = req.user.userid || req.user.id;

  try {
    const [rows] = await db.query(`
      SELECT 
        S.KEYWORD,
        U.USERID AS userid,
        U.USERNAME AS username,
        U.PROFILE_IMG AS avatar
      FROM SEARCH_HISTORY S
      JOIN USERS U ON S.KEYWORD = U.USERID
      WHERE S.USER_ID = ?
      ORDER BY S.SEARCHED_AT DESC
      LIMIT 10
    `, [userId]);

    res.json(rows);
  } catch (err) {
    console.error("검색 기록 가져오기 실패:", err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// 검색 기록 삭제
router.post('/delete-history', authMiddleware, async (req, res) => {
  const userId = req.user.userid || req.user.id;
  const { keyword } = req.body;

  if (!keyword) {
    return res.status(400).json({ error: '삭제할 검색어가 없습니다.' });
  }

  try {
    await db.query(`
      DELETE FROM SEARCH_HISTORY
      WHERE USER_ID = ? AND KEYWORD = ?
      LIMIT 1
    `, [userId, keyword]);

    res.json({ success: true });
  } catch (err) {
    console.error("검색 기록 삭제 실패:", err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// 홈 팔로우 체크
router.get('/follow/check', authMiddleware, async (req, res) => {
  const currentUserId = req.user.userid || req.user.id;
  const targetUserId = req.query.target;

  if (!targetUserId) {
    return res.status(400).json({ error: 'target 파라미터가 필요합니다.' });
  }

  try {
    const [rows] = await db.query(
      `SELECT 1 FROM FOLLOWS WHERE FOLLOWER_ID = ? AND FOLLOWEE_ID = ? LIMIT 1`,
      [currentUserId, targetUserId]
    );

    res.json({ isFollowing: rows.length > 0 });
  } catch (err) {
    console.error("팔로우 여부 확인 실패:", err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// 댓글 생성 (댓글/대댓글)
router.post('/:postId/comments', authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { content, parentId } = req.body;
  const userId = req.user.userid || req.user.id;

  if (!content || !userId) {
    return res.status(400).json({ error: '필수 값 누락' });
  }

  try {
    const sql = "INSERT INTO COMMENT "
              + "VALUES (NULL, ?, ?, ?, ?, 0, NOW())";
    const [result] = await db.query(sql, [postId, userId, content, parentId]);

    const commentId = result.insertId;

    // 댓글 알림 (부모가 있으면 대댓글 → 부모에게, 없으면 원글 작성자에게)
    let targetUserId = null;
    if (parentId) {
      const [[parentComment]] = await db.query(`SELECT USER_ID FROM COMMENT WHERE ID = ?`, [parentId]);
      targetUserId = parentComment.USER_ID;
    } else {
      const [[post]] = await db.query(`SELECT USER_ID FROM POST WHERE ID = ?`, [postId]);
      targetUserId = post.USER_ID;
    }

    if (targetUserId !== userId) {
      const [[fromUser]] = await db.query(`SELECT USERNAME, PROFILE_IMG FROM USERS WHERE USERID = ?`, [userId]);

      await db.query(`
        INSERT INTO NOTIFICATIONS (user_id, from_userid, type, target_id, cdatetime)
        VALUES (?, ?, 'comment', ?, NOW())
      `, [targetUserId, userId, commentId]);

      sendNotification(targetUserId, {
        type: 'comment',
        from_userid: userId,
        senderUsername: fromUser.USERNAME,
        senderProfile: fromUser.PROFILE_IMG,
        target_id: commentId,
        cdatetime: new Date()
      });
    }

    res.json({
      id: result.insertId,
      userid: userId,
      content,
      parentId: parentId || null
    });
  } catch (err) {
    console.error("댓글 등록 실패:", err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// 댓글 조회 (댓글 + 대댓글)
router.get('/:postId/comments', authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.userid || req.user.id;

  try {
    const [rows] = await db.query(`
      SELECT 
        C.ID AS id,
        C.USER_ID AS userId,
        C.CONTENT AS content,
        C.PARENT_ID AS parentId,
        C.CDATETIME AS cdatetime,
        EXISTS (
          SELECT 1 FROM COMMENT_LIKES CL WHERE CL.COMMENT_ID = C.ID AND CL.USER_ID = ?
        ) AS liked,
        (
          SELECT COUNT(*) FROM COMMENT_LIKES CL2 WHERE CL2.COMMENT_ID = C.ID
        ) AS contentLike
      FROM COMMENT C
      WHERE C.POST_ID = ?
      ORDER BY C.CDATETIME ASC
    `, [userId, postId]
    );
    res.json(rows);
  } catch (err) {
    console.error("댓글 조회 실패:", err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// 댓글 수정
router.put('/comments/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user.userid || req.user.id;

  if (!content) {
    return res.status(400).json({ error: '댓글 내용이 없습니다.' });
  }

  try {
    // 본인 확인
    const [rows] = await db.query(
      'SELECT * FROM COMMENT WHERE ID = ? AND USER_ID = ?',
      [id, userId]
    );

    if (rows.length === 0) {
      return res.status(403).json({ error: '수정 권한이 없습니다.' });
    }

    await db.query(
      'UPDATE COMMENT SET CONTENT = ?, CDATETIME = NOW() WHERE ID = ?',
      [content, id]
    );

    res.json({ success: true, message: '댓글 수정 완료' });
  } catch (err) {
    console.error('댓글 수정 오류:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// 댓글 삭제 (자식 삭제)
router.delete('/comments/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userid || req.user.id;

  try {
    // 본인 댓글 확인
    const [rows] = await db.query(
      'SELECT * FROM COMMENT WHERE ID = ? AND USER_ID = ?',
      [id, userId]
    );
    if (rows.length === 0) {
      return res.status(403).json({ error: '삭제 권한이 없습니다.' });
    }

    // 삭제 대상 트리 추출 (자식 먼저)
    const [treeRows] = await db.query(`
      WITH RECURSIVE CommentTree AS (
        SELECT ID, 0 AS level FROM COMMENT WHERE ID = ?
        UNION ALL
        SELECT c.ID, ct.level + 1
        FROM COMMENT c
        INNER JOIN CommentTree ct ON c.PARENT_ID = ct.ID
      )
      SELECT ID FROM CommentTree ORDER BY level DESC
    `, [id]);

    // COMMENT_LIKES → COMMENT 순으로 삭제
    for (const row of treeRows) {
      await db.query('DELETE FROM COMMENT_LIKES WHERE COMMENT_ID = ?', [row.ID]);
      await db.query('DELETE FROM COMMENT WHERE ID = ?', [row.ID]);
    }

    res.json({ success: true, message: '댓글 및 관련 좋아요 삭제 완료' });
  } catch (err) {
    console.error('재귀 댓글 삭제 오류:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// 댓글 좋아요 토글
router.post('/comments/:id/like', authMiddleware, async (req, res) => {
  const { id: commentId } = req.params;
  const userId = req.user.userid || req.user.id;

  try {
    // 1. 현재 유저가 이미 좋아요 눌렀는지 확인
    const [existing] = await db.query(
      `SELECT 1 FROM COMMENT_LIKES WHERE COMMENT_ID = ? AND USER_ID = ?`,
      [commentId, userId]
    );

    if (existing.length > 0) {
      // 2. 이미 눌렀으면 좋아요 취소
      await db.query(
        `DELETE FROM COMMENT_LIKES WHERE COMMENT_ID = ? AND USER_ID = ?`,
        [commentId, userId]
      );
      res.json({ status: 'unliked' });
    } else {
      // 3. 안 눌렀으면 좋아요 등록
      await db.query(
        `INSERT INTO COMMENT_LIKES (COMMENT_ID, USER_ID) VALUES (?, ?)`,
        [commentId, userId]
      );

      const [[comment]] = await db.query(`SELECT USER_ID FROM COMMENT WHERE ID = ?`, [commentId]);
      const targetUserId = comment.USER_ID;

      if (targetUserId !== userId) {
        const [[fromUser]] = await db.query(`SELECT USERNAME, PROFILE_IMG FROM USERS WHERE USERID = ?`, [userId]);

        await db.query(`
          INSERT INTO NOTIFICATIONS (user_id, from_userid, type, target_id, cdatetime)
          VALUES (?, ?, 'comment_like', ?, NOW())
        `, [targetUserId, userId, commentId]);

        sendNotification(targetUserId, {
          type: 'comment_like',
          from_userid: userId,
          senderUsername: fromUser.USERNAME,
          senderProfile: fromUser.PROFILE_IMG,
          target_id: commentId,
          cdatetime: new Date()
        });
      }

      res.json({ status: 'liked' });
    }
  } catch (err) {
    console.error('댓글 좋아요 오류:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// 게시물 삭제
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userid;

    // 작성자 본인 확인
    const [post] = await db.query('SELECT * FROM POST WHERE ID = ? AND USER_ID = ?', [id, userId]);
    if (post.length === 0) return res.status(403).json({ message: '권한 없음' });

    // 관련 데이터 삭제 순서대로
    await db.query('DELETE FROM COMMENT WHERE POST_ID = ?', [id]);
    await db.query('DELETE FROM LIKES WHERE POST_ID = ?', [id]);
    await db.query('DELETE FROM POST_IMG WHERE POST_ID = ?', [id]);
    await db.query('DELETE FROM POST WHERE ID = ?', [id]);

    res.json({ success: true });
  } catch (err) {
    console.error("게시물 삭제 중 오류:", err);
    res.status(500).json({ message: '서버 오류 발생', error: err.message });
  }
});

// 게시물 수정
router.put('/:id', authMiddleware, upload.array('images', 10), async (req, res) => {
  const { id } = req.params;
  const { content, existingImages } = req.body;
  const userId = req.user.userid;

  try {
    const [posts] = await db.query('SELECT * FROM POST WHERE ID = ? AND USER_ID = ?', [id, userId]);
    if (posts.length === 0) return res.status(403).json({ message: '권한 없음' });

    await db.query('UPDATE POST SET CONTENT = ?, UDATETIME = NOW() WHERE ID = ?', [content, id]);

    let keepImageNames = [];
    try {
      const parsed = JSON.parse(existingImages || '[]');
      keepImageNames = parsed
        .filter(p => typeof p === 'string')       // 문자열만 필터
        .map(p => path.basename(p))               // 파일명만 추출
        .filter(name => !!name);                  // 빈 값 제거
    } catch (e) {
      console.error('existingImages 파싱 오류:', e);
      return res.status(400).json({ success: false, message: '기존 이미지 형식 오류' });
    }

    const [rows] = await db.query('SELECT * FROM POST_IMG WHERE POST_ID = ?', [id]);
    for (const row of rows) {
      if (!row?.IMG_PATH || typeof row.IMG_PATH !== 'string') {
        continue;
      }
    
      const dbImageName = path.basename(row.IMG_PATH);
      const shouldDelete = !keepImageNames.includes(dbImageName);
    
      if (shouldDelete) {
        try {
          const filePath = path.join(__dirname, '..', 'uploads', dbImageName);
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          await db.query('DELETE FROM POST_IMG WHERE ID = ?', [row.ID]);
          console.log(`이미지 삭제: ${dbImageName}`);
        } catch (err) {
          console.error('이미지 삭제 실패:', err);
        }
      }
    }      

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const imageUrl = '/uploads/' + file.filename;
        await db.query('INSERT INTO POST_IMG (POST_ID, IMG_PATH) VALUES (?, ?)', [id, imageUrl]);
      }
    }    

    res.json({ success: true });
  } catch (err) {
    console.error('게시물 수정 오류:', err);
    res.status(500).json({ success: false, message: '서버 오류', error: err.message });
  }
});

// 게시물 상세 조회
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // 게시물 본문 조회
    const [posts] = await db.query(`
      SELECT P.*, U.USERID, U.USERNAME, U.PROFILE_IMG
      FROM POST P
      JOIN USERS U ON P.USER_ID = U.USERID
      WHERE P.ID = ?
    `, [id]);    
    if (posts.length === 0) {
      return res.status(404).json({ message: '해당 게시물이 없습니다.' });
    }

    const [imgs] = await db.query('SELECT IMG_PATH FROM POST_IMG WHERE POST_ID = ?', [id]);

    const imagePaths = imgs.map(img => img.IMG_PATH); // 정확한 필드 이름 사용

    res.json({
      ...posts[0],
      content: posts[0].CONTENT,
      images: imagePaths,
      userid: posts[0].USERID,
      username: posts[0].USERNAME,
      userProfile: posts[0].PROFILE_IMG,
    });
  } catch (err) {
    console.error('게시물 조회 오류:', err);
    res.status(500).json({ message: '서버 오류', error: err.message });
  }
});

// 북마크 추가 또는 제거
router.post('/:id/bookmark', authMiddleware, async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  const [rows] = await db.query(
    'SELECT * FROM BOOKMARK WHERE USER_ID = ? AND POST_ID = ?', [userId, postId]
  );

  if (rows.length > 0) {
    await db.query('DELETE FROM BOOKMARK WHERE USER_ID = ? AND POST_ID = ?', [userId, postId]);
    return res.json({ bookmarked: false });
  } else {
    await db.query('INSERT INTO BOOKMARK (USER_ID, POST_ID) VALUES (?, ?)', [userId, postId]);
    return res.json({ bookmarked: true });
  }
});

// 북마크 여부 확인
router.get('/:id/bookmarked', authMiddleware, async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  const [rows] = await db.query(
    'SELECT * FROM BOOKMARK WHERE USER_ID = ? AND POST_ID = ?', [userId, postId]
  );

  res.json({ bookmarked: rows.length > 0 });
});

module.exports = router;