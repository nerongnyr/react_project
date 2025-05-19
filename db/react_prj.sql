-- --------------------------------------------------------
-- 호스트:                          127.0.0.1
-- 서버 버전:                        8.0.41 - MySQL Community Server - GPL
-- 서버 OS:                        Win64
-- HeidiSQL 버전:                  12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- sample1 데이터베이스 구조 내보내기
CREATE DATABASE IF NOT EXISTS `sample1` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `sample1`;

-- 테이블 sample1.blocked_users 구조 내보내기
CREATE TABLE IF NOT EXISTS `blocked_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `blocked_userid` int DEFAULT NULL,
  `cdatetime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `blocked_userid` (`blocked_userid`),
  CONSTRAINT `blocked_users_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `blocked_users_ibfk_2` FOREIGN KEY (`blocked_userid`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.blocked_users:~0 rows (대략적) 내보내기

-- 테이블 sample1.board 구조 내보내기
CREATE TABLE IF NOT EXISTS `board` (
  `BOARDNO` int NOT NULL AUTO_INCREMENT,
  `TITLE` varchar(100) DEFAULT NULL,
  `CONTENTS` varchar(200) DEFAULT NULL,
  `USERID` varchar(45) DEFAULT NULL,
  `CDATETIME` datetime DEFAULT NULL,
  `UDATETIME` datetime DEFAULT NULL,
  PRIMARY KEY (`BOARDNO`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.board:~2 rows (대략적) 내보내기
INSERT INTO `board` (`BOARDNO`, `TITLE`, `CONTENTS`, `USERID`, `CDATETIME`, `UDATETIME`) VALUES
	(1, '제목11', '내용11', 'user01', '2025-02-03 17:01:28', '2025-02-03 17:01:28'),
	(2, '제목22', '내용22', 'user01', '2025-02-03 17:05:15', '2025-02-03 17:05:15'),
	(3, '제목33', '내용33', 'user01', '2025-02-03 17:06:26', '2025-02-03 17:06:26');

-- 테이블 sample1.bookmark 구조 내보내기
CREATE TABLE IF NOT EXISTS `bookmark` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `USER_ID` varchar(255) NOT NULL,
  `POST_ID` int NOT NULL,
  `CREATED_AT` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.bookmark:~3 rows (대략적) 내보내기
INSERT INTO `bookmark` (`ID`, `USER_ID`, `POST_ID`, `CREATED_AT`) VALUES
	(3, '4', 4, '2025-05-15 18:42:21'),
	(4, '1', 4, '2025-05-18 12:35:21'),
	(5, '1', 2, '2025-05-18 12:35:32');

-- 테이블 sample1.chat_members 구조 내보내기
CREATE TABLE IF NOT EXISTS `chat_members` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `jdatetime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `room_id` (`room_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `chat_members_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `chat_rooms` (`id`),
  CONSTRAINT `chat_members_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.chat_members:~8 rows (대략적) 내보내기
INSERT INTO `chat_members` (`id`, `room_id`, `user_id`, `jdatetime`) VALUES
	(1, 1, NULL, '2025-05-15 16:41:45'),
	(2, 1, 4, '2025-05-15 16:41:45'),
	(3, 2, NULL, '2025-05-15 16:47:53'),
	(4, 2, 4, '2025-05-15 16:47:53'),
	(5, 3, NULL, '2025-05-15 16:59:47'),
	(6, 3, 4, '2025-05-15 16:59:47'),
	(7, 4, 1, '2025-05-15 17:13:31'),
	(8, 4, 4, '2025-05-15 17:13:31'),
	(9, 5, 5, '2025-05-18 17:30:04'),
	(10, 5, 2, '2025-05-18 17:30:04');

-- 테이블 sample1.chat_messages 구조 내보내기
CREATE TABLE IF NOT EXISTS `chat_messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room_id` int DEFAULT NULL,
  `sender_id` int DEFAULT NULL,
  `content` varchar(1000) DEFAULT NULL,
  `file_url` varchar(1000) DEFAULT NULL,
  `file_type` varchar(50) DEFAULT NULL,
  `cdatetime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `room_id` (`room_id`),
  KEY `sender_id` (`sender_id`),
  CONSTRAINT `chat_messages_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `chat_rooms` (`id`),
  CONSTRAINT `chat_messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.chat_messages:~5 rows (대략적) 내보내기
INSERT INTO `chat_messages` (`id`, `room_id`, `sender_id`, `content`, `file_url`, `file_type`, `cdatetime`) VALUES
	(1, 2, NULL, '안녕', NULL, 'text', '2025-05-15 16:51:18'),
	(2, 3, NULL, 'ㅇㅇ', NULL, 'text', '2025-05-15 17:00:06'),
	(3, 4, 1, 'dkssud', NULL, 'text', '2025-05-15 17:13:35'),
	(4, 4, 1, 'dd', NULL, 'text', '2025-05-15 17:13:52'),
	(5, 4, 4, 'ㅇㅇ', NULL, 'text', '2025-05-15 17:55:17'),
	(6, 5, 5, 'ㅎㅇㅎㅇ', NULL, 'text', '2025-05-18 17:30:07'),
	(7, 5, 2, 'ㅇㅇㅎㅇㅎㅇ', NULL, 'text', '2025-05-18 17:32:40'),
	(8, 4, 1, 'dnd', NULL, 'text', '2025-05-19 09:33:20'),
	(9, 4, 1, '하하', NULL, 'text', '2025-05-19 09:33:29'),
	(10, 4, 1, 'ㅇㅇ', NULL, 'text', '2025-05-19 09:33:33');

-- 테이블 sample1.chat_read 구조 내보내기
CREATE TABLE IF NOT EXISTS `chat_read` (
  `id` int NOT NULL AUTO_INCREMENT,
  `message_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `read_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `message_id` (`message_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `chat_read_ibfk_1` FOREIGN KEY (`message_id`) REFERENCES `chat_messages` (`id`),
  CONSTRAINT `chat_read_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.chat_read:~8 rows (대략적) 내보내기
INSERT INTO `chat_read` (`id`, `message_id`, `user_id`, `read_at`) VALUES
	(1, 5, 1, '2025-05-15 18:09:15'),
	(2, 5, 1, '2025-05-15 18:09:19'),
	(3, 5, 1, '2025-05-15 18:10:31'),
	(4, 5, 1, '2025-05-15 18:11:35'),
	(5, 5, 1, '2025-05-15 18:11:41'),
	(6, 5, 4, '2025-05-15 18:12:16'),
	(7, 5, 4, '2025-05-15 18:47:28'),
	(8, 5, 1, '2025-05-18 12:35:12'),
	(9, 5, 1, '2025-05-18 14:39:06'),
	(10, 5, 1, '2025-05-18 16:57:00'),
	(11, 6, 5, '2025-05-18 17:30:11'),
	(12, 6, 2, '2025-05-18 17:32:36'),
	(13, 7, 2, '2025-05-18 17:32:46'),
	(14, 7, 2, '2025-05-18 17:42:32'),
	(15, 7, 2, '2025-05-18 17:44:24'),
	(16, 7, 2, '2025-05-18 17:52:04'),
	(17, 7, 2, '2025-05-18 17:56:46'),
	(18, 5, 1, '2025-05-19 09:33:15'),
	(19, 8, 1, '2025-05-19 09:33:26'),
	(20, 10, 1, '2025-05-19 09:33:36');

-- 테이블 sample1.chat_rooms 구조 내보내기
CREATE TABLE IF NOT EXISTS `chat_rooms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `is_group` tinyint(1) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `cdatetime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.chat_rooms:~4 rows (대략적) 내보내기
INSERT INTO `chat_rooms` (`id`, `is_group`, `name`, `cdatetime`) VALUES
	(1, 0, NULL, '2025-05-15 16:41:45'),
	(2, 0, NULL, '2025-05-15 16:47:53'),
	(3, 0, NULL, '2025-05-15 16:59:47'),
	(4, 0, NULL, '2025-05-15 17:13:31'),
	(5, 0, NULL, '2025-05-18 17:30:04');

-- 테이블 sample1.comment 구조 내보내기
CREATE TABLE IF NOT EXISTS `comment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `post_id` int DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `content` varchar(1000) DEFAULT NULL,
  `parent_id` int DEFAULT NULL,
  `content_like` int DEFAULT '0',
  `cdatetime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `post_id` (`post_id`),
  KEY `parent_id` (`parent_id`),
  KEY `comment_ibfk_2` (`user_id`),
  CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`),
  CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`userid`) ON DELETE CASCADE,
  CONSTRAINT `comment_ibfk_3` FOREIGN KEY (`parent_id`) REFERENCES `comment` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.comment:~5 rows (대략적) 내보내기
INSERT INTO `comment` (`id`, `post_id`, `user_id`, `content`, `parent_id`, `content_like`, `cdatetime`) VALUES
	(1, 4, 'shrimp', 'ㅇㅇ', NULL, 0, '2025-05-14 11:04:05'),
	(2, 4, 'shrimp', 'test1', 1, 0, '2025-05-14 11:04:14'),
	(3, 4, 'shrimp', 'dd', 2, 0, '2025-05-14 12:10:10'),
	(4, 4, 'shrimp', 'ss', 3, 0, '2025-05-14 12:10:15'),
	(8, 6, 'nerong', '응아니야', NULL, 0, '2025-05-18 16:59:08'),
	(9, 6, 'nerong', '@nerong 응맞아', 8, 0, '2025-05-18 17:25:24'),
	(10, 1, 'shrimp', '집갈게용', NULL, 0, '2025-05-18 17:29:43');

-- 테이블 sample1.comment_likes 구조 내보내기
CREATE TABLE IF NOT EXISTS `comment_likes` (
  `COMMENT_ID` int NOT NULL,
  `USER_ID` varchar(50) NOT NULL,
  PRIMARY KEY (`COMMENT_ID`,`USER_ID`),
  KEY `USER_ID` (`USER_ID`),
  CONSTRAINT `comment_likes_ibfk_1` FOREIGN KEY (`COMMENT_ID`) REFERENCES `comment` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comment_likes_ibfk_2` FOREIGN KEY (`USER_ID`) REFERENCES `users` (`userid`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.comment_likes:~2 rows (대략적) 내보내기
INSERT INTO `comment_likes` (`COMMENT_ID`, `USER_ID`) VALUES
	(1, 'nerong'),
	(4, 'nerong'),
	(8, 'nerong');

-- 테이블 sample1.draft_posts 구조 내보내기
CREATE TABLE IF NOT EXISTS `draft_posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `content` text,
  `last_saved` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `draft_posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.draft_posts:~0 rows (대략적) 내보내기

-- 테이블 sample1.follows 구조 내보내기
CREATE TABLE IF NOT EXISTS `follows` (
  `id` int NOT NULL AUTO_INCREMENT,
  `FOLLOWER_ID` varchar(50) DEFAULT NULL,
  `FOLLOWEE_ID` varchar(50) DEFAULT NULL,
  `cdatetime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `follows_ibfk_1` (`FOLLOWER_ID`),
  KEY `follows_ibfk_2` (`FOLLOWEE_ID`),
  CONSTRAINT `follows_ibfk_1` FOREIGN KEY (`FOLLOWER_ID`) REFERENCES `users` (`userid`),
  CONSTRAINT `follows_ibfk_2` FOREIGN KEY (`FOLLOWEE_ID`) REFERENCES `users` (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.follows:~0 rows (대략적) 내보내기
INSERT INTO `follows` (`id`, `FOLLOWER_ID`, `FOLLOWEE_ID`, `cdatetime`) VALUES
	(3, 'nerong', 'pooryn', NULL),
	(4, 'shrimp', 'nerong', NULL),
	(5, 'nerong', 'shrimp', NULL),
	(6, 'nerong', 'nayerin', NULL),
	(7, 'pooryn', 'nerong', NULL);

-- 테이블 sample1.likes 구조 내보내기
CREATE TABLE IF NOT EXISTS `likes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(50) DEFAULT NULL,
  `post_id` int DEFAULT NULL,
  `cdatetime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`post_id`),
  KEY `post_id` (`post_id`),
  CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`userid`),
  CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.likes:~7 rows (대략적) 내보내기
INSERT INTO `likes` (`id`, `user_id`, `post_id`, `cdatetime`) VALUES
	(6, 'shrimp', 3, '2025-05-13 13:05:10'),
	(9, 'pooryn', 3, '2025-05-14 15:39:13'),
	(10, 'pooryn', 1, '2025-05-14 15:39:21'),
	(11, 'nerong', 2, '2025-05-18 12:37:58'),
	(12, 'nerong', 1, '2025-05-18 12:38:03'),
	(13, 'nerong', 4, '2025-05-18 12:38:11'),
	(15, 'nerong', 3, '2025-05-18 12:57:23'),
	(17, 'pooryn', 4, '2025-05-18 13:09:18'),
	(18, 'nerong', 6, '2025-05-18 16:56:51'),
	(19, 'shrimp', 1, '2025-05-18 17:29:32');

-- 테이블 sample1.message_reactions 구조 내보내기
CREATE TABLE IF NOT EXISTS `message_reactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `message_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `reaction` varchar(50) DEFAULT NULL,
  `cdatetime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `message_id` (`message_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `message_reactions_ibfk_1` FOREIGN KEY (`message_id`) REFERENCES `chat_messages` (`id`),
  CONSTRAINT `message_reactions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.message_reactions:~0 rows (대략적) 내보내기

-- 테이블 sample1.notifications 구조 내보내기
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(50) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `from_userid` varchar(50) DEFAULT NULL,
  `target_type` varchar(50) DEFAULT NULL,
  `target_id` int DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `cdatetime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_notifications_userid` (`user_id`),
  KEY `fk_notifications_from_userid` (`from_userid`),
  CONSTRAINT `fk_notifications_from_userid` FOREIGN KEY (`from_userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE,
  CONSTRAINT `fk_notifications_userid` FOREIGN KEY (`user_id`) REFERENCES `users` (`userid`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.notifications:~0 rows (대략적) 내보내기
INSERT INTO `notifications` (`id`, `user_id`, `type`, `from_userid`, `target_type`, `target_id`, `is_read`, `cdatetime`) VALUES
	(1, 'nerong', 'like', 'pooryn', NULL, 4, 0, '2025-05-18 13:09:18'),
	(2, 'shrimp', 'like', 'nerong', NULL, 6, 0, '2025-05-18 16:56:51'),
	(3, 'shrimp', 'comment', 'nerong', NULL, 8, 0, '2025-05-18 16:58:58'),
	(4, 'nerong', 'like', 'shrimp', NULL, 1, 0, '2025-05-18 17:29:32'),
	(5, 'nerong', 'comment', 'shrimp', NULL, 10, 0, '2025-05-18 17:29:43');

-- 테이블 sample1.post 구조 내보내기
CREATE TABLE IF NOT EXISTS `post` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(50) DEFAULT NULL,
  `content` varchar(1000) DEFAULT NULL,
  `cdatetime` datetime DEFAULT NULL,
  `udatetime` datetime DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.post:~4 rows (대략적) 내보내기
INSERT INTO `post` (`id`, `user_id`, `content`, `cdatetime`, `udatetime`, `is_deleted`) VALUES
	(1, 'nerong', 'ㅎㅎㅎ', '2025-05-12 17:32:38', '2025-05-12 17:32:38', NULL),
	(2, 'nerong', '하하하', '2025-05-13 10:23:10', '2025-05-13 10:23:10', NULL),
	(3, 'pooryn', '안냐세용헤헤헤', '2025-05-13 10:45:09', '2025-05-15 10:10:51', NULL),
	(4, 'nerong', '강아', '2025-05-13 16:59:52', '2025-05-13 16:59:52', NULL),
	(6, 'shrimp', '포켓', '2025-05-18 16:26:42', '2025-05-18 16:26:42', NULL);

-- 테이블 sample1.post_img 구조 내보내기
CREATE TABLE IF NOT EXISTS `post_img` (
  `imgNo` int NOT NULL AUTO_INCREMENT,
  `post_id` int DEFAULT NULL,
  `img_name` varchar(255) DEFAULT NULL,
  `img_path` varchar(1000) DEFAULT NULL,
  `thumbnail` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`imgNo`),
  KEY `post_id` (`post_id`),
  CONSTRAINT `post_img_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.post_img:~11 rows (대략적) 내보내기
INSERT INTO `post_img` (`imgNo`, `post_id`, `img_name`, `img_path`, `thumbnail`) VALUES
	(1, 1, 'park2.jpg', '/uploads/1747038758207-park2.jpg', '1'),
	(2, 1, 'puppy.jpg', '/uploads/1747038758209-puppy.jpg', '0'),
	(3, 1, 'ë¤ì´ë¡ë.jfif', '/uploads/1747038758209-ë¤ì´ë¡ë.jfif', '0'),
	(4, 2, 'haerinie.png', '/uploads/1747099390766-haerinie.png', '1'),
	(5, 2, 'hehe.jpg', '/uploads/1747099390768-hehe.jpg', '0'),
	(6, 3, 'OIP (1).jpg', '/uploads/1747100709756-OIP (1).jpg', '1'),
	(7, 3, 'puppyy.jpg', '/uploads/1747100709758-puppyy.jpg', '0'),
	(8, 3, 'puppyyy.jpg', '/uploads/1747100709758-puppyyy.jpg', '0'),
	(9, 4, 'puppy.jpg', '/uploads/1747123192649-puppy.jpg', '1'),
	(10, 4, 'puppyy.jpg', '/uploads/1747123192650-puppyy.jpg', '0'),
	(11, 4, 'puppyyy.jpg', '/uploads/1747123192650-puppyyy.jpg', '0'),
	(13, 6, 'poket1.jpg', '/uploads/1747553202867-poket1.jpg', '1'),
	(14, 6, 'poket2.jpg', '/uploads/1747553202870-poket2.jpg', '0');

-- 테이블 sample1.report 구조 내보내기
CREATE TABLE IF NOT EXISTS `report` (
  `id` int NOT NULL AUTO_INCREMENT,
  `reporter_id` int DEFAULT NULL,
  `target_type` varchar(50) DEFAULT NULL,
  `target_id` int DEFAULT NULL,
  `reason` text,
  `cdatetime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reporter_id` (`reporter_id`),
  CONSTRAINT `report_ibfk_1` FOREIGN KEY (`reporter_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.report:~0 rows (대략적) 내보내기

-- 테이블 sample1.saved_posts 구조 내보내기
CREATE TABLE IF NOT EXISTS `saved_posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `post_id` int DEFAULT NULL,
  `cdatetime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `post_id` (`post_id`),
  CONSTRAINT `saved_posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `saved_posts_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.saved_posts:~0 rows (대략적) 내보내기

-- 테이블 sample1.search_history 구조 내보내기
CREATE TABLE IF NOT EXISTS `search_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(50) DEFAULT NULL,
  `keyword` varchar(255) DEFAULT NULL,
  `searched_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_keyword` (`user_id`,`keyword`),
  CONSTRAINT `search_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`userid`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.search_history:~9 rows (대략적) 내보내기
INSERT INTO `search_history` (`id`, `user_id`, `keyword`, `searched_at`) VALUES
	(4, 'nerong', 'ㅔ', '2025-05-13 16:44:20'),
	(6, 'nerong', 'pooryn', '2025-05-13 16:44:26'),
	(7, 'nerong', 'p', '2025-05-13 16:44:32'),
	(8, 'nerong', 's', '2025-05-13 16:44:47'),
	(10, 'nerong', 'shirp', '2025-05-13 16:44:51'),
	(11, 'nerong', 'shir', '2025-05-13 16:44:52'),
	(12, 'nerong', 'shi', '2025-05-13 16:44:54'),
	(13, 'nerong', 'sh', '2025-05-13 16:44:55'),
	(15, 'nerong', 'na', '2025-05-18 16:32:14'),
	(19, 'nerong', 'ㅇ', '2025-05-18 16:43:14'),
	(24, 'nerong', 'ㅜ', '2025-05-18 16:50:39'),
	(26, 'nerong', 'n', '2025-05-18 16:55:21'),
	(27, 'nerong', 'nayerin', '2025-05-18 16:55:24');

-- 테이블 sample1.search_trends 구조 내보내기
CREATE TABLE IF NOT EXISTS `search_trends` (
  `keyword` varchar(255) NOT NULL,
  `count` int DEFAULT NULL,
  `cdatetime` datetime DEFAULT NULL,
  PRIMARY KEY (`keyword`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.search_trends:~0 rows (대략적) 내보내기

-- 테이블 sample1.stories 구조 내보내기
CREATE TABLE IF NOT EXISTS `stories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `content` text,
  `media_path` varchar(1000) DEFAULT NULL,
  `media_type` varchar(50) DEFAULT NULL,
  `cdatetime` datetime DEFAULT NULL,
  `edatetime` datetime DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `stories_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.stories:~0 rows (대략적) 내보내기

-- 테이블 sample1.story_reactions 구조 내보내기
CREATE TABLE IF NOT EXISTS `story_reactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `story_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `reaction` varchar(50) DEFAULT NULL,
  `cdatetime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `story_id` (`story_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `story_reactions_ibfk_1` FOREIGN KEY (`story_id`) REFERENCES `stories` (`id`),
  CONSTRAINT `story_reactions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.story_reactions:~0 rows (대략적) 내보내기

-- 테이블 sample1.story_views 구조 내보내기
CREATE TABLE IF NOT EXISTS `story_views` (
  `id` int NOT NULL AUTO_INCREMENT,
  `story_id` int DEFAULT NULL,
  `viewer_id` int DEFAULT NULL,
  `viewed_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `story_id` (`story_id`),
  KEY `viewer_id` (`viewer_id`),
  CONSTRAINT `story_views_ibfk_1` FOREIGN KEY (`story_id`) REFERENCES `stories` (`id`),
  CONSTRAINT `story_views_ibfk_2` FOREIGN KEY (`viewer_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.story_views:~0 rows (대략적) 내보내기

-- 테이블 sample1.student 구조 내보내기
CREATE TABLE IF NOT EXISTS `student` (
  `stu_no` char(8) NOT NULL,
  `stu_name` varchar(12) DEFAULT NULL,
  `stu_dept` varchar(20) DEFAULT NULL,
  `stu_grade` int DEFAULT NULL,
  `stu_class` char(1) DEFAULT NULL,
  `stu_gender` char(1) DEFAULT NULL,
  `stu_height` int DEFAULT NULL,
  `stu_weight` int DEFAULT NULL,
  PRIMARY KEY (`stu_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.student:~10 rows (대략적) 내보내기
INSERT INTO `student` (`stu_no`, `stu_name`, `stu_dept`, `stu_grade`, `stu_class`, `stu_gender`, `stu_height`, `stu_weight`) VALUES
	('20131001', '김종헌', '컴퓨터정보', 3, 'C', 'M', NULL, 72),
	('20131025', '옥성우', '컴퓨터정보', 3, 'A', 'F', 172, 63),
	('20132003', '박희철', '전기전자', 3, 'B', 'M', NULL, 63),
	('20141007', '진현무', '컴퓨터정보', 2, 'A', 'M', 174, 64),
	('20142021', '심수정', '전기전자', 2, 'A', 'F', 168, 45),
	('20143054', '유가인', '기계', 2, 'C', 'F', 154, 47),
	('20151062', '김인중', '컴퓨터정보', 1, 'B', 'M', 166, 67),
	('20152088', '조민우', '전기전자', 1, 'C', 'M', 188, 90),
	('20153075', '옥한빛', '기계', 1, 'C', 'M', 177, 80),
	('20153088', '이태연', '기계', 1, 'C', 'F', 162, 50);

-- 테이블 sample1.tags 구조 내보내기
CREATE TABLE IF NOT EXISTS `tags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.tags:~0 rows (대략적) 내보내기

-- 테이블 sample1.tbl_board 구조 내보내기
CREATE TABLE IF NOT EXISTS `tbl_board` (
  `boardNo` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `contents` text NOT NULL,
  `userId` varchar(50) NOT NULL,
  `cnt` int DEFAULT '0',
  `cdatetime` datetime DEFAULT CURRENT_TIMESTAMP,
  `udatetime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`boardNo`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.tbl_board:~14 rows (대략적) 내보내기
INSERT INTO `tbl_board` (`boardNo`, `title`, `contents`, `userId`, `cnt`, `cdatetime`, `udatetime`) VALUES
	(1, '오늘의 기분은 어떨까요?', '오늘은 날씨도 우중충하고 기분이 좋아요! 이런 날은 밖에 나가서 기분 전환을 해보는 것도 좋겠죠?', 'user001', 10, '2025-04-01 08:00:00', '2025-04-24 16:36:29'),
	(3, '우리는 왜 이렇게 바쁠까요?', '요즘 바쁜 일상 속에서 여유를 찾는 게 점점 더 어려워지는 것 같아요. 여러분은 어떻게 여유를 찾고 계신가요?', 'user003', 5, '2025-04-03 11:15:00', '2025-04-03 11:15:00'),
	(4, '하루를 마무리하며', '오늘 하루가 어떻게 지나갔는지 한번 되돌아보며, 내일은 더 좋은 하루가 되기를 바래봅니다.', 'user004', 15, '2025-04-04 13:45:00', '2025-04-04 13:45:00'),
	(5, '새로운 시작, 새로운 도전', '새로운 프로젝트를 시작했습니다! 이렇게 시작하는 게 설렙니다. 실패를 두려워하지 말자고 마음먹고 도전해보려 합니다.', 'user001', 8, '2025-04-05 14:00:00', '2025-04-05 14:00:00'),
	(6, '주말에는 무엇을 할까요?', '주말에는 모두 무엇을 할 예정인가요? 저는 집에서 휴식을 취하며 영화를 보고 싶어요. 다들 어떻게 보내세요?', 'user002', 12, '2025-04-06 10:10:00', '2025-04-06 10:10:00'),
	(7, '오늘의 책 한 권', '오늘 읽은 책이 정말 인상 깊었어요. 특히 그 부분이 마음에 와 닿았습니다. 여러분도 한 번 읽어보세요!', 'user003', 20, '2025-04-07 11:45:00', '2025-04-07 11:45:00'),
	(9, '디지털 시대의 장단점', '디지털 기술이 발달하면서 우리의 삶이 많이 변화했어요. 그러나 그만큼 불편함도 따르죠. 이 변화가 과연 좋은 것일까요?', 'user001', 18, '2025-04-09 09:30:00', '2025-04-09 09:30:00'),
	(10, '새로운 취미를 시작하다', '최근에 새로운 취미를 시작했어요. 정말 재밌고 시간이 빠르게 지나가네요. 여러분도 새로 시작한 취미가 있나요?', 'user002', 22, '2025-04-10 10:00:00', '2025-04-10 10:00:00'),
	(11, '인생의 작은 변화', '작은 변화가 인생을 크게 바꿀 수 있다는 말을 요즘 실감하고 있어요. 여러분도 그런 순간을 경험해보셨나요?', 'user003', 14, '2025-04-11 16:00:00', '2025-04-11 16:00:00'),
	(12, '어린 시절의 추억', '어린 시절의 추억이 떠오릅니다. 그때는 아무 걱정 없이 뛰어놀았던 기억들이 아직도 생생하네요.', 'user004', 7, '2025-04-12 12:10:00', '2025-04-12 12:10:00'),
	(13, '행복이란 무엇일까?', '행복의 의미를 잘 모르겠어요. 사람마다 다르게 정의할 수 있겠지만, 저는 그냥 작은 것에서 행복을 느끼고 싶어요.', 'user001', 16, '2025-04-13 14:30:00', '2025-04-13 14:30:00'),
	(14, '음악의 힘', '요즘 음악이 정말 큰 힘이 돼요. 힘든 하루를 보내고 있을 때, 좋은 음악 한 곡이 모든 걸 바꿀 수 있다는 걸 느껴요.', 'user002', 19, '2025-04-14 08:45:00', '2025-04-14 08:45:00'),
	(15, '자기 계발의 중요성', '자기 계발은 왜 중요한지, 그 이유에 대해 고민해보게 됩니다. 꾸준히 노력하며 성장해가는 것이 중요하다고 생각해요.', 'user003', 11, '2025-04-15 10:00:00', '2025-04-15 10:00:00'),
	(16, 'ㅇ', 'ㅇ', '', 0, '2025-04-24 16:17:03', '2025-04-24 16:17:03');

-- 테이블 sample1.tbl_feed 구조 내보내기
CREATE TABLE IF NOT EXISTS `tbl_feed` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` varchar(100) DEFAULT NULL,
  `title` varchar(50) DEFAULT NULL,
  `content` text,
  `cdatetime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.tbl_feed:~8 rows (대략적) 내보내기
INSERT INTO `tbl_feed` (`id`, `userId`, `title`, `content`, `cdatetime`) VALUES
	(19, 'poo@test.com', 'ㅇㅇ', 'd', '2025-05-02 03:04:57'),
	(20, 'poo@test.com', 'ㅋㅋ', 'ㅇ', '2025-05-02 03:19:17'),
	(21, 'poo@test.com', 'ㅊ', 'ㅊ', '2025-05-02 03:19:36'),
	(22, 'poo@test.com', 'ㄴ', 'ㄴ', '2025-05-02 03:23:36'),
	(23, 'poo@test.com', 'ㅋㅋ', 'ㄴ', '2025-05-02 03:25:09'),
	(24, 'poo@test.com', 'ㅋㅋ', 'ㄴ', '2025-05-02 03:26:28'),
	(25, 'poo@test.com', 'ㅋㅋ', 'ㄴ', '2025-05-02 03:28:40'),
	(26, 'poo@test.com', 'ㅋㅋ', 'ㄴ', '2025-05-02 03:38:24'),
	(27, 'poo@test.com', '리액트 재밌다', '리액트는 정말 재밌어요!', '2025-05-02 03:40:22');

-- 테이블 sample1.tbl_feed_img 구조 내보내기
CREATE TABLE IF NOT EXISTS `tbl_feed_img` (
  `imgNo` int NOT NULL AUTO_INCREMENT,
  `feedId` int NOT NULL,
  `imgName` varchar(255) NOT NULL,
  `imgPath` varchar(500) NOT NULL,
  `thumbnail` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`imgNo`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.tbl_feed_img:~8 rows (대략적) 내보내기
INSERT INTO `tbl_feed_img` (`imgNo`, `feedId`, `imgName`, `imgPath`, `thumbnail`) VALUES
	(1, 25, 'park1.jpg', '/uploads/1746156520521-park1.jpg', '1'),
	(2, 25, 'park2.jpg', '/uploads/1746156520522-park2.jpg', '0'),
	(3, 26, 'dohoon (9).jpg', '/uploads/1746157104005-dohoon (9).jpg', 'Y'),
	(4, 26, 'haerinie.jfif', '/uploads/1746157104007-haerinie.jfif', 'Y'),
	(5, 26, 'hehe.jpg', '/uploads/1746157104007-hehe.jpg', 'Y'),
	(6, 27, 'dohoon (9).jpg', '/uploads/1746157222722-dohoon (9).jpg', '1'),
	(7, 27, 'haerinie.jfif', '/uploads/1746157222724-haerinie.jfif', '0'),
	(8, 27, 'hehe.jpg', '/uploads/1746157222724-hehe.jpg', '0');

-- 테이블 sample1.tbl_member 구조 내보내기
CREATE TABLE IF NOT EXISTS `tbl_member` (
  `email` varchar(255) NOT NULL,
  `pwd` varchar(255) NOT NULL,
  `userName` varchar(100) NOT NULL,
  `addr` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `birth` date DEFAULT NULL,
  `profileImg` varchar(255) DEFAULT NULL,
  `cdatetime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `udatetime` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `intro` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.tbl_member:~5 rows (대략적) 내보내기
INSERT INTO `tbl_member` (`email`, `pwd`, `userName`, `addr`, `phone`, `birth`, `profileImg`, `cdatetime`, `udatetime`, `intro`) VALUES
	('nerong@test.com', '$2b$10$b6uQuYA37lp8/uE56wGFk..YTDmJgU18Q3bzz/yywmpZ4vMNYvSLq', '나예린', '인천', '1247', '2025-05-01', '/uploads/1746086774101-haerinie.png', '2025-05-01 03:14:11', '2025-05-01 08:06:14', '안녕하세요! SNS를 통해 친구들과 소통하고 있습니다. 사진과 일상을 공유하는 것을 좋아해요.'),
	('poo@test.com', '$2b$10$QjEmM46iYjLVXUpC5iJuxefak4n2rxGZzxPKSe5NxvZknS5oStOnm', '응가', '인천', '1106', '2025-05-01', '/uploads/1746087349053-haerin.png', '2025-05-01 03:15:33', '2025-05-01 08:15:49', '안녕하세요! SNS를 통해 친구들과 소통하고 있습니다. 사진과 일상을 공유하는 것을 좋아해요.'),
	('qqq@test.com', '$2b$10$ozf.uBx3r88vb6xawmc0w.Id8Tl969UQf3mnysANF7RIXWcKfQrjS', '김철수', '인천', '1357', '2025-05-01', NULL, '2025-05-01 03:14:49', '2025-05-01 03:20:34', '안녕하세요! SNS를 통해 친구들과 소통하고 있습니다. 사진과 일상을 공유하는 것을 좋아해요.'),
	('test@test.com', '$2b$10$eIN7yVhSZSTy41WH9o0anOXYUP6bd2bPwVJfVA1WhMpPZAuYKxF0K', '홍길동', '인천', '1234', '2025-05-01', NULL, '2025-05-01 03:13:11', '2025-05-01 03:20:34', '안녕하세요! SNS를 통해 친구들과 소통하고 있습니다. 사진과 일상을 공유하는 것을 좋아해요.'),
	('zzz@test.com', '$2b$10$nivvX3LIPBRdCeczjv96gOq.HiRze86ANzkshsuTxMP5NuUdIqDcq', '김영희', '인천', '1236', '2025-05-01', NULL, '2025-05-01 03:14:29', '2025-05-01 03:20:34', '안녕하세요! SNS를 통해 친구들과 소통하고 있습니다. 사진과 일상을 공유하는 것을 좋아해요.');

-- 테이블 sample1.tbl_product 구조 내보내기
CREATE TABLE IF NOT EXISTS `tbl_product` (
  `productId` int NOT NULL AUTO_INCREMENT,
  `productName` varchar(100) NOT NULL,
  `description` text,
  `price` decimal(10,0) NOT NULL,
  `stock` int DEFAULT '0',
  `category` varchar(50) DEFAULT NULL,
  `isAvailable` varchar(1) DEFAULT NULL,
  `cdatetime` datetime DEFAULT CURRENT_TIMESTAMP,
  `udatetime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`productId`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.tbl_product:~20 rows (대략적) 내보내기
INSERT INTO `tbl_product` (`productId`, `productName`, `description`, `price`, `stock`, `category`, `isAvailable`, `cdatetime`, `udatetime`) VALUES
	(1, '무선 이어폰', '고음질 블루투스 무선 이어폰', 79000, 120, '전자기기', 'Y', '2025-04-22 10:35:06', '2025-04-22 10:35:06'),
	(2, '남성 반팔티', '여름용 면 반팔티셔츠', 19900, 50, '의류', 'Y', '2025-04-22 10:35:06', '2025-04-22 10:35:06'),
	(4, '핸드크림', '보습력이 뛰어난 핸드크림', 8500, 200, '생활용품', 'Y', '2025-04-22 10:35:06', '2025-04-22 10:35:06'),
	(5, '여성 청바지', '스트레치 데님 청바지', 35900, 35, '의류', 'Y', '2025-04-22 10:35:06', '2025-04-22 10:35:06'),
	(6, '휴대폰 케이스', '아이폰 14 전용 실리콘 케이스', 12000, 75, '전자기기', 'Y', '2025-04-22 10:35:06', '2025-04-22 10:35:06'),
	(7, 'LED 스탠드', '조도 조절 가능한 LED 책상용 스탠드', 33000, 60, '생활용품', 'Y', '2025-04-22 10:35:06', '2025-04-22 10:35:06'),
	(9, '스포츠 양말', '운동용 흡한속건 기능성 양말', 5900, 300, '의류', 'Y', '2025-04-22 10:35:06', '2025-04-22 10:35:06'),
	(10, '텀블러 500ml', '보온보냉 가능한 스테인리스 텀블러', 21000, 90, '생활용품', 'Y', '2025-04-22 10:35:06', '2025-04-22 10:35:06'),
	(11, 'USB-C 충전기', '65W 고속충전기', 39000, 100, '전자기기', 'Y', '2025-04-22 10:35:06', '2025-04-22 10:35:06'),
	(12, '면 화장솜', '100매입 무형광 화장솜', 3000, 180, '생활용품', 'Y', '2025-04-22 10:35:06', '2025-04-22 10:35:06'),
	(13, '여성 니트', '겨울용 따뜻한 브이넥 니트', 49900, 22, '의류', 'Y', '2025-04-22 10:35:06', '2025-04-22 10:35:06'),
	(14, '샤워볼', '거품 잘 나는 목욕용 샤워볼', 2500, 150, '생활용품', 'Y', '2025-04-22 10:35:06', '2025-04-22 10:35:06'),
	(15, '블루투스 스피커', '휴대용 미니 블루투스 스피커', 42000, 45, '전자기기', 'Y', '2025-04-22 10:35:06', '2025-04-22 10:35:06'),
	(16, '에코백', '캔버스 소재 친환경 에코백', 17900, 110, '의류', 'Y', '2025-04-22 10:35:06', '2025-04-22 10:35:06'),
	(17, '헤어드라이기', '1200W 강풍모드 드라이기', 32000, 55, '생활용품', 'Y', '2025-04-22 10:35:06', '2025-04-22 10:35:06'),
	(18, '휴대용 선풍기', 'USB 충전식 미니 선풍기', 15000, 130, '전자기기', 'Y', '2025-04-22 10:35:06', '2025-04-22 10:35:06'),
	(19, '기모 레깅스', '겨울용 따뜻한 기모 레깅스', 22900, 38, '의류', 'Y', '2025-04-22 10:35:06', '2025-04-22 10:35:06'),
	(20, '수세미 세트', '3개입 친환경 수세미 세트', 4900, 210, '생활용품', 'Y', '2025-04-22 10:35:06', '2025-04-22 10:35:06'),
	(22, '무선 이어폰', '고음질 블루투스 무선 이어폰', 79000, 120, '전자기가지니', 'Y', '2025-04-22 15:41:33', '2025-04-22 15:41:33'),
	(23, '1', '1', 1, 1, '1', 'Y', '2025-04-23 17:13:03', '2025-04-23 17:13:03'),
	(24, '1', '2', 3, 4, '5', 'Y', '2025-04-23 17:31:08', '2025-04-23 17:31:08');

-- 테이블 sample1.tbl_product_file 구조 내보내기
CREATE TABLE IF NOT EXISTS `tbl_product_file` (
  `fileNo` int NOT NULL AUTO_INCREMENT,
  `productId` int DEFAULT NULL,
  `fileName` varchar(255) DEFAULT NULL,
  `filePath` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`fileNo`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.tbl_product_file:~7 rows (대략적) 내보내기
INSERT INTO `tbl_product_file` (`fileNo`, `productId`, `fileName`, `filePath`) VALUES
	(1, 24, 'nyang.png', '/uploads/1745397068418_nyang.png'),
	(2, 15, 'park2.jpg', '/uploads/1745992324943-park2.jpg'),
	(3, 16, 'ë¤ì´ë¡ë.jfif', '/uploads/1745992449741-ë¤ì´ë¡ë.jfif'),
	(4, 17, 'ë¤ì´ë¡ë.jfif', '/uploads/1745992527753-ë¤ì´ë¡ë.jfif'),
	(5, 18, 'dohoon (7).jpg', '/uploads/1745998310397-dohoon (7).jpg'),
	(6, 18, 'haerinie.jfif', '/uploads/1745998310399-haerinie.jfif'),
	(7, 18, 'puppy.jpg', '/uploads/1745998310399-puppy.jpg');

-- 테이블 sample1.tbl_user 구조 내보내기
CREATE TABLE IF NOT EXISTS `tbl_user` (
  `userId` varchar(50) NOT NULL,
  `pwd` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `userName` varchar(50) NOT NULL,
  `addr` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `cdatetime` datetime DEFAULT CURRENT_TIMESTAMP,
  `udatetime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` varchar(1) DEFAULT 'C',
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.tbl_user:~14 rows (대략적) 내보내기
INSERT INTO `tbl_user` (`userId`, `pwd`, `userName`, `addr`, `phone`, `cdatetime`, `udatetime`, `status`) VALUES
	('1', '1', '1', '1', '1', '2025-04-23 15:36:02', '2025-04-23 15:36:02', 'C'),
	('2', '$2b$10$p6VInTDnVii8p7ZfxeBY/e1DShYJPuaRarIFTR1IXBIKJtxsNqTIu', '3', '4', '5', '2025-04-23 15:45:43', '2025-04-23 15:45:43', 'C'),
	('test1', '$2b$10$MHg8N8tAKM2rwAhocIa77Od/dxOoTVInVM2b7I8TPgJCcwYB9U8pO', '새우', '인천', '01012345678', '2025-04-23 15:59:05', '2025-04-30 10:33:32', 'A'),
	('user', '$2b$10$656iNsgHW/dBE1JVAIn5FO8KC8.0Culjg11CuJ9LLOEgS8AhsnwX6', '예리니', '인천', '12345678', '2025-04-23 16:03:34', '2025-04-23 16:03:34', 'C'),
	('user001', 'pwd1', '홍길동', '서울', '010-1111-2222', '2025-04-23 09:32:41', '2025-04-23 12:47:15', 'A'),
	('user002', 'pwd2', '김철수', '인천', '010-2233-4455', '2025-04-23 09:32:41', '2025-04-23 09:32:41', 'C'),
	('user003', 'pwd3', '이영희', '대전', '010-3344-5566', '2025-04-23 09:32:41', '2025-04-23 09:32:41', 'C'),
	('user004', 'pwd4', '박지민', '광주', '010-4455-6677', '2025-04-23 09:32:41', '2025-04-23 09:32:41', 'C'),
	('user005', 'pwd5', '최민수', '서울', '010-5566-7788', '2025-04-23 09:32:41', '2025-04-23 09:32:41', 'C'),
	('user006', 'pwd6', '정수진', '부산', '010-6677-8899', '2025-04-23 09:32:41', '2025-04-23 09:32:41', 'C'),
	('user007', 'pwd7', '김하늘', '인천', '010-7788-9900', '2025-04-23 09:32:41', '2025-04-23 09:32:41', 'C'),
	('user008', 'pwd8', '이상훈', '울산', '010-8899-1000', '2025-04-23 09:32:41', '2025-04-23 09:32:41', 'C'),
	('user009', 'pwd9', '박세영', '대구', '010-9900-1111', '2025-04-23 09:32:41', '2025-04-23 09:32:41', 'C'),
	('user010', 'pwd10', '정예린', '경기', '010-1001-1222', '2025-04-23 09:32:41', '2025-04-23 09:32:41', 'C');

-- 테이블 sample1.users 구조 내보내기
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userid` varchar(30) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `profile_img` text,
  `bio` text,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `addr` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `cdatetime` datetime DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `userid` (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.users:~4 rows (대략적) 내보내기
INSERT INTO `users` (`id`, `userid`, `username`, `email`, `password`, `profile_img`, `bio`, `phone`, `addr`, `cdatetime`, `last_login`) VALUES
	(1, 'nerong', '홍길동', 'email1@test.com', '$2b$10$y7egXI9qe7MhyMUHMmttCuEzpJxhuRfD0jhDo9mR/B8euqvAhFqpq', '/uploads/1747289108742-haerinie.png', '나임', '01012345678', '인천', '2025-05-08 11:39:20', '2025-05-08 11:39:20'),
	(2, 'nayerin', '나예린', 'email2@test.com', '$2b$10$yHnGrudl2auOjCEUIwbQz.5ArH.TwwcWJCCjR6l8dn2GSja5SvkGm', NULL, '나 이다', '01062534475', '인천', '2025-05-08 13:07:06', '2025-05-08 13:07:06'),
	(3, 'youngh', '김영희', 'email3@test.com', '$2b$10$M3/wAV0szYA0ijNhDcj0K.wniUc4H6aJJ5buN.jcnQkrO2Yqg7hDq', NULL, '영히', '01098765432', '인천', '2025-05-08 13:08:04', '2025-05-08 13:08:04'),
	(4, 'pooryn', '똥', 'poonyr@test.com', '$2b$10$aiSSTQUTYzfNd3nB6W2iG.EoLV6ZgLAxPORrAqsvgt.NimA6PvI96', '/uploads/1747556905713-ë¤ì´ë¡ë.jfif', '헤헤안뇽', '01014725836', '인천시', '2025-05-08 14:56:22', '2025-05-08 14:56:22'),
	(5, 'shrimp', '새우', 'shrimp123@test.com', '$2b$10$VOpZ3XldlioivCZ9Nv8FAOQ7vHm48Z9u/Osxr1hXKKjvw.qhNRM.6', NULL, NULL, '01064854625', '인천시', '2025-05-08 15:09:03', '2025-05-08 15:09:03');

-- 테이블 sample1.user_settings 구조 내보내기
CREATE TABLE IF NOT EXISTS `user_settings` (
  `user_id` int NOT NULL,
  `allow_dm` tinyint(1) DEFAULT '1',
  `push_notification` tinyint(1) DEFAULT '1',
  `theme` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `user_settings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.user_settings:~0 rows (대략적) 내보내기

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
