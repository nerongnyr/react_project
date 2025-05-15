import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Avatar, Button, TextField, Box, Typography
} from '@mui/material';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function EditProfileDialog({ open, onClose, userData, onSave }) {
  const [previewImg, setPreviewImg] = useState(userData?.profileImg || '/avatars/default.png');
  const [bio, setBio] = useState(userData?.bio || '');
  const [memberInfo, setMemberInfo] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);
  const token = localStorage.getItem("token");
  const sessionUser = useMemo(() => token ? jwtDecode(token) : {}, [token]);
  const navigate = useNavigate();

  const selectImg = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setImgUrl(imgUrl);
      setProfileImg(file);
      setPreviewImg(imgUrl);
    }
  };

  const handleMember = useCallback(() => {
    let url = "http://localhost:3005/sns-user";
    if (!token) {
      navigate("/login");
      return;
    }
    if (sessionUser.userid) {
      url += "?userid=" + sessionUser.userid;
    }
  
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.list && data.list.length > 0) {
          setMemberInfo(data.list[0]); // 첫 번째 사용자 정보 저장
        }
      })
      .catch((err) => {
        console.error("사용자 정보 가져오기 실패:", err);
      });
  }, [token, sessionUser, navigate]);  

  useEffect(() => {
    handleMember();
  }, [handleMember]);

  useEffect(() => {
    if (memberInfo) {
      setBio(memberInfo.bio || '');
      setPreviewImg(memberInfo.profileImg || '/avatars/default.png');
    }
  }, [memberInfo]);

  const handleSave = () => {
    if (!imgUrl && !bio) return;

    console.log("profileImg:", profileImg);

    const formData = new FormData();
    if (profileImg) formData.append('profileImg', profileImg);
    formData.append('userid', sessionUser.userid);
    formData.append('bio', bio);

    fetch('http://localhost:3005/sns-user/profile', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('프로필 저장 완료!');
          onSave?.();
          setImgUrl(null);
          setProfileImg(null);
          onClose();
        } else {
          alert('저장 실패');
        }
      })
      .catch(err => {
        console.error('저장 실패:', err);
      });
    };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          width: '700px',
          maxWidth: '90vw',
          borderRadius: 3,
          p: 3
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 'bold' }}>프로필 편집</DialogTitle>
      <DialogContent>
        {/* 아바타 + ID + 이름 + 사진 변경 버튼 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
          <Avatar src={previewImg} sx={{ width: 80, height: 80 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {memberInfo?.userid || 'userid'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {memberInfo?.username || 'username'}
            </Typography>
          </Box>
          <Button
            variant="contained"
            component="label"
            sx={{
              backgroundColor: '#0095f6',
              textTransform: 'none',
              borderRadius: 2,
              fontWeight: 'bold'
            }}
          >
            사진 변경
            <input type="file" hidden accept="image/*" onChange={selectImg} />
          </Button>
        </Box>
  
        {/* 소개 입력란 */}
        <Typography fontWeight="bold" mb={1}>소개</Typography>
        <TextField
          placeholder="소개"
          fullWidth
          multiline
          minRows={3}
          inputProps={{ maxLength: 150 }}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          variant="outlined"
          sx={{ mb: 1, maxWidth: 500 }}
        />
        <Typography variant="caption" color="text.secondary">
          {bio.length} / 150
        </Typography>
      </DialogContent>
  
      {/* 액션 버튼 */}
      <DialogActions sx={{ justifyContent: 'space-between', px: 3 }}>
        <Button onClick={onClose}>취소</Button>
        <Button variant="contained" onClick={handleSave}>저장</Button>
      </DialogActions>
    </Dialog>
  );  
}