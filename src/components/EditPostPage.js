import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RegisterDialog from '../components/RegisterDialog';

export default function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  // 게시물 데이터 불러오기
  useEffect(() => {
    fetch(`http://localhost:3005/sns-post/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('게시물을 불러오지 못했습니다.');
        return res.json();
      })
      .then((data) => {
        setPost(data);
      })
      .catch((err) => {
        alert(err.message);
        navigate(-1); // 실패 시 뒤로가기
      });
  }, [id, navigate]);

  return (
    post && (
      <RegisterDialog
        open={true}
        post={post}
        onClose={() => navigate(-1)} // 닫기 시 이전 페이지로
        onSuccess={() => navigate('/')} // 수정 완료 시 홈으로 이동 등
      />
    )
  );
}
