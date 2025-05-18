import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  Avatar,
  InputAdornment,
  IconButton,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom'; 

export default function SearchPanel() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const inputRef = useRef();
  const [sessionUser, setSessionUser] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setSessionUser(decoded);
      } catch (err) {
        console.error("토큰 디코딩 실패:", err);
        setSessionUser(null);
      }
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!sessionUser || !token) return;

    fetch("http://localhost:3005/sns-post/search-history", {
      headers: { Authorization: "Bearer " + token }
    })
      .then(res => res.json())
      .then(data => setHistory(data))
      .catch(err => console.error("검색 기록 불러오기 실패:", err.message));
  }, [sessionUser]);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      setLoading(false);
      return;
    }

    if (!sessionUser) return;

    setLoading(true);
    const timeout = setTimeout(() => {
      const token = localStorage.getItem("token");

      fetch("http://localhost:3005/sns-post/search-users?query=" + encodeURIComponent(query), {
        method: 'GET',
        headers: { "Authorization": "Bearer " + token }
      })
        .then(res => res.json())
        .then((data) => {
          console.log(data)
          setResults(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("검색 실패:", err.message);
          setResults([]);
          setLoading(false);
        });
    }, 400);

    return () => clearTimeout(timeout);
  }, [query, sessionUser]);

  const toggleFollow = async (targetId) => {
    const token = localStorage.getItem("token");
    const res = await fetch('http://localhost:3005/sns-user/follow/toggle', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ targetUserId: targetId })
    });
    const data = await res.json();
    setResults(prev =>
      prev.map(user =>
        user.userid === targetId ? { ...user, isFollowing: data.isFollowing } : user
      )
    );
  };

  const handleDeleteHistory = (userid) => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3005/sns-post/delete-history", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ keyword: userid })
    })
      .then(res => res.json())
      .then(() => {
        setHistory(prev => prev.filter(item => item.userid !== userid));
      })
      .catch(err => {
        console.error("기록 삭제 실패:", err.message);
      });
  };

  return (
    <Box sx={{ p: 2, bgcolor: '#fff', height: '100%', overflowY: 'auto' }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>검색</Typography>

      <TextField
        fullWidth
        placeholder="사용자 검색..."
        variant="outlined"
        size="small"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        inputRef={inputRef}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: '#999' }} />
            </InputAdornment>
          ),
          sx: { borderRadius: 2, backgroundColor: '#f1f1f1' }
        }}
      />

      {!loading && query.trim() === '' && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: '#888' }}>
            최근 검색 기록
          </Typography>
          {history.length > 0 ? (
            history.map((user, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 1,
                  py: 1.2,
                  borderRadius: 1,
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }} onClick={() => setQuery(user.userid)}>
                  <Avatar src={user.avatar} sx={{ width: 36, height: 36, mr: 1 }} />
                  <Box>
                    <Typography variant="body2">{user.username || user.userid}</Typography>
                    <Typography variant="caption" color="text.secondary">@{user.userid}</Typography>
                  </Box>
                </Box>
                <IconButton size="small" onClick={() => handleDeleteHistory(user.userid)}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ))
          ) : (
            <Typography sx={{ color: '#aaa', fontSize: 14, textAlign: 'center' }}>
              최근 검색어가 없습니다.
            </Typography>
          )}
        </Box>
      )}

      {!loading && results.length > 0 && (
        <Box sx={{ mt: 2 }}>
          {results.map((user, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 1,
                py: 1.5,
                borderRadius: 1,
                cursor: 'pointer',
                '&:hover': { backgroundColor: '#f5f5f5' }
              }}
            >
              <Box
                onClick={() => {
                  navigate(`/profile/${user.userid}`)
                  setQuery(user.userid)
                  inputRef.current?.focus();
                }} 
                sx={{ display: 'flex', alignItems: 'center', flex: 1 }}
              >
                <Avatar src={"http://localhost:3005" + user.avatar || '/avatars/default.png'} alt={user.username} sx={{ width: 44, height: 44, mr: 2 }} />
                <Box>
                  <Typography variant="subtitle2" fontWeight={500}>
                    {user.username || user.userid}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    @{user.userid}
                  </Typography>
                </Box>
              </Box>

              {user.userid !== sessionUser?.userid && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation(); // navigate 방지
                    toggleFollow(user.userid);
                  }}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 2,
                    ml: 2,
                    minWidth: 80
                  }}
                >
                  {user.isFollowing ? "팔로잉" : "팔로우"}
                </Button>
              )}
            </Box>
          ))}
        </Box>
      )}

      {!loading && query.trim() !== '' && results.length === 0 && (
        <Typography sx={{ mt: 3, textAlign: 'center', color: '#888' }}>
          검색 결과가 없습니다.
        </Typography>
      )}
    </Box>
  );
}
