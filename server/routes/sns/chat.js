const express = require('express');
const router = express.Router();
const authMiddleware = require('../../auth');
const db = require('../../db');
const multer = require('multer');
const path = require('path');

// 파일 업로드 설정
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// 채팅방 목록 조회
router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db.query(`
      SELECT
        r.id AS room_id,
        r.is_group,
        r.name AS room_name,
        u.userid AS partner_user_id,
        u.profile_img AS avatar,
        m.content AS message,
        m.cdatetime AS time
      FROM chat_rooms r
      JOIN chat_members cm1 ON r.id = cm1.room_id
      LEFT JOIN chat_members cm2 ON r.id = cm2.room_id AND cm2.user_id != ?
      LEFT JOIN users u ON cm2.user_id = u.id
      LEFT JOIN chat_messages m ON m.id = (
        SELECT id FROM chat_messages
        WHERE room_id = r.id
        ORDER BY cdatetime DESC
        LIMIT 1
      )
      WHERE cm1.user_id = ?
      ORDER BY m.cdatetime DESC
    `, [userId, userId]);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 메시지 불러오기
router.get('/:room_id/messages', authMiddleware, async (req, res) => {
    const roomId = req.params.room_id;
    const userId = req.user.id;
  
    try {
      const [messages] = await db.query(`
        SELECT m.*, 
          EXISTS (
            SELECT 1 FROM chat_read r 
            WHERE r.message_id = m.id AND r.user_id != ?
          ) AS is_read
        FROM chat_messages m
        WHERE m.room_id = ?
        ORDER BY m.id ASC
      `, [userId, roomId]);
  
      res.json(messages);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: '메시지 불러오기 실패' });
    }
});  

// 메시지 전송 (파일 포함 가능)
router.post('/:room_id/messages', authMiddleware, upload.single('file'), async (req, res) => {
  const roomId = req.params.room_id;
  const senderId = req.user.id;
  const { content, file_type } = req.body;
  const file = req.file;

  const file_url = file ? '/uploads/' + file.filename : null;

  try {
    await db.query(
      'INSERT INTO chat_messages (room_id, sender_id, content, file_url, file_type, cdatetime) VALUES (?, ?, ?, ?, ?, NOW())',
      [roomId, senderId, content, file_url, file_type]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '메시지 저장 실패' });
  }
});

// 채팅방 생성 (1:1 또는 그룹)
router.post('/', authMiddleware, async (req, res) => {
  const myId = req.user.id;
  const { is_group, targetUserId, name, userIds } = req.body;

  try {
    let roomId;

    if (!is_group) {
      // 1. 이미 존재하는 1:1 채팅방 확인
        const [existing] = await db.query(`
            SELECT r.id
            FROM chat_rooms r
            JOIN chat_members m1 ON r.id = m1.room_id
            JOIN chat_members m2 ON r.id = m2.room_id
            WHERE r.is_group = 0
            AND m1.user_id = ? AND m2.user_id = ?
        `, [myId, targetUserId]);
        
        if (existing.length > 0) {
            return res.json({ success: true, roomId: existing[0].id });
        }  

      const [result] = await db.query(
        'INSERT INTO chat_rooms (is_group, name, cdatetime) VALUES (0, NULL, NOW())'
      );
      roomId = result.insertId;

      await db.query(
        'INSERT INTO chat_members (room_id, user_id, jdatetime) VALUES (?, ?, NOW()), (?, ?, NOW())',
        [roomId, myId, roomId, targetUserId]
      );
    } else {
      const [result] = await db.query(
        'INSERT INTO chat_rooms (is_group, name, cdatetime) VALUES (1, ?, NOW())',
        [name]
      );
      roomId = result.insertId;

      const values = userIds.map(uid => [roomId, uid, new Date()]);
      await db.query(
        'INSERT INTO chat_members (room_id, user_id, jdatetime) VALUES ?',
        [values]
      );
    }

    res.json({ success: true, roomId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '채팅방 생성 실패' });
  }
});

router.post('/:room_id/read', authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const roomId = req.params.room_id;
  
    try {
      // 가장 마지막 메시지 찾기
      const [[latest]] = await db.query(`
        SELECT id FROM chat_messages
        WHERE room_id = ?
        ORDER BY id DESC LIMIT 1
      `, [roomId]);
  
      if (!latest) return res.json({ success: false, message: '메시지가 없음' });
  
      // INSERT OR UPDATE
      await db.query(`
        INSERT INTO chat_read
        VALUES (NULL, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE read_at = NOW(), message_id = VALUES(message_id)
      `, [latest.id, userId]);
  
      res.json({ success: true });
    } catch (err) {
      console.error('읽음 처리 실패:', err);
      res.status(500).json({ success: false });
    }
  });  

module.exports = router;