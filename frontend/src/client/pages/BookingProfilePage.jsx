import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { IconCalendar, IconUsers, IconCoin, IconTrash, IconStar } from '@tabler/icons-react';
import api from '../../api/api';

const Container = styled.div`
  max-width: 1000px;
  margin: 40px auto;
  padding: 0 20px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 32px;
`;

const BookingList = styled.div`
  display: grid;
  gap: 20px;
`;

const BookingCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const CardHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: start;
  margin-bottom: 16px;
  gap: 16px;
`;

const TourName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
`;

const BookingId = styled.p`
  font-size: 13px;
  color: #999;
  margin: 0;
`;

const Status = styled.span`
  display: inline-block;
  padding: 6px 12px;
  background: ${props => {
    if (props.status === 'pending') return '#ffd700';
    if (props.status === 'confirmed') return '#4caf50';
    if (props.status === 'cancelled') return '#f44336';
    return '#2196f3';
  }};
  color: white;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const InfoIcon = styled.div`
  color: #ff6b35;
  display: flex;
  align-items: center;
  margin-top: 2px;
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoLabel = styled.p`
  font-size: 12px;
  color: #999;
  margin: 0 0 4px 0;
  text-transform: uppercase;
  font-weight: 600;
`;

const InfoValue = styled.p`
  font-size: 14px;
  color: #333;
  margin: 0;
  font-weight: 500;
`;

const CustomerInfo = styled.div`
  background: #f9f9f9;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 13px;
`;

const CustomerRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const CustomerLabel = styled.span`
  color: #666;
  font-weight: 500;
`;

const CustomerValue = styled.span`
  color: #333;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    border-color: #ff6b35;
    color: #ff6b35;
  }
  
  &.delete {
    border-color: #f44336;
    color: #f44336;
    
    &:hover {
      background: #ffebee;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #999;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

// ===== Comments & Ratings Styles =====
const CommentsSection = styled.div`
  margin-top: 24px;
  border-top: 2px solid #e0e0e0;
  padding-top: 24px;
`;

const CommentsTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
`;

const CommentsTabs = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
`;

const CommentTab = styled.button`
  padding: 12px 0;
  border: none;
  background: none;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.active ? '#ff6b35' : '#999'};
  border-bottom: ${props => props.active ? '3px solid #ff6b35' : 'none'};
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    color: #ff6b35;
  }
`;

const RatingSection = styled.div`
  background: #f9f9f9;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const RatingForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const RatingLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

const RatingInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #ff6b35;
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
  }
`;

const RatingTextarea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  min-height: 100px;
  font-family: inherit;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #ff6b35;
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
  }
`;

const RatingStars = styled.div`
  display: flex;
  gap: 8px;
  margin: 8px 0;
`;

const Star = styled.button`
  border: none;
  background: none;
  color: ${props => props.active ? '#ffc107' : '#ddd'};
  font-size: 24px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  
  &:hover {
    color: #ffc107;
    transform: scale(1.2);
  }
`;

const RatingButton = styled.button`
  padding: 10px 16px;
  background: #ff6b35;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background: #e55a1f;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CommentCard = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s;
  
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const CommentAuthor = styled.span`
  font-weight: 600;
  color: #333;
  font-size: 14px;
`;

const CommentDate = styled.span`
  font-size: 12px;
  color: #999;
`;

const CommentRating = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
`;

const CommentText = styled.p`
  margin: 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
`;

const Loading = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
`;

const BottomCommentSection = styled.div`
  margin-top: 32px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
`;

const BottomForm = styled.form`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  flex-wrap: wrap;
`;

const BottomSelect = styled.select`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
`;

const BottomTextarea = styled.textarea`
  flex: 1 1 400px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  min-height: 60px;
  resize: vertical;
`;

const BookingProfilePage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [globalComment, setGlobalComment] = useState('');
  const [globalRating, setGlobalRating] = useState(5);
  const [selectedTourForComment, setSelectedTourForComment] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  // when bookings load, set a default selected tour for the bottom comment box
  useEffect(() => {
    if (bookings.length > 0 && !selectedTourForComment) {
      const first = bookings[0];
      setSelectedTourForComment(first.tourId || first.tour_id || (first.tour && first.tour.id) || null);
    }
  }, [bookings, selectedTourForComment]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/bookings/my-bookings');
      setBookings(response.data?.data || []);
      setError(null);
    } catch (err) {
      setError('Không thể tải danh sách booking');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Bạn chắc chắn muốn hủy booking này?')) {
      try {
        await api.delete(`/bookings/${bookingId}`);
        setBookings(bookings.filter(b => b.id !== bookingId));
        alert('Hủy booking thành công');
      } catch (err) {
        alert('Lỗi khi hủy booking: ' + err.message);
      }
    }
  };

  const handleSubmitGlobalComment = async (e) => {
    e.preventDefault();
    if (!selectedTourForComment) {
      alert('Vui lòng chọn tour để đánh giá');
      return;
    }
    if (!globalComment.trim()) {
      alert('Vui lòng nhập nội dung bình luận');
      return;
    }

    try {
      await api.post('/comments', {
        tourId: selectedTourForComment,
        content: globalComment,
        rating: globalRating
      });
      alert('Gửi bình luận thành công');
      setGlobalComment('');
      // optionally refresh bookings/comments here
    } catch (err) {
      console.error('Error submitting global comment', err);
      alert('Lỗi khi gửi bình luận');
    }
  };

  if (loading) return <Loading>Đang tải dữ liệu...</Loading>;

  return (
    <Container>
      <Title>Lịch sử booking của tôi</Title>

      {bookings.length === 0 ? (
        <EmptyState>
          <EmptyIcon>📭</EmptyIcon>
          <p>Bạn chưa có booking nào</p>
          <p style={{ fontSize: '13px', marginTop: '8px' }}>
            Hãy tìm và đặt tour yêu thích của bạn
          </p>
        </EmptyState>
      ) : (
        <BookingList>
          {bookings.map(booking => (
            <BookingCard key={booking.id}>
              <CardHeader>
                <div>
                  <TourName>{booking.tourName || 'Tour'}</TourName>
                  <BookingId>Mã đặt tour: #{booking.id}</BookingId>
                </div>
                <Status status={booking.status || 'pending'}>
                  {booking.status === 'pending' && 'Chờ xác nhận'}
                  {booking.status === 'confirmed' && 'Đã xác nhận'}
                  {booking.status === 'cancelled' && 'Đã hủy'}
                  {booking.status === 'completed' && 'Hoàn thành'}
                </Status>
              </CardHeader>

              <InfoGrid>
                <InfoItem>
                  <InfoIcon>
                    <IconCalendar size={20} />
                  </InfoIcon>
                  <InfoContent>
                    <InfoLabel>Ngày xuất phát</InfoLabel>
                    <InfoValue>
                      {new Date(booking.startDate).toLocaleDateString('vi-VN')}
                    </InfoValue>
                  </InfoContent>
                </InfoItem>

                <InfoItem>
                  <InfoIcon>
                    <IconCalendar size={20} />
                  </InfoIcon>
                  <InfoContent>
                    <InfoLabel>Ngày về</InfoLabel>
                    <InfoValue>
                      {new Date(booking.endDate).toLocaleDateString('vi-VN')}
                    </InfoValue>
                  </InfoContent>
                </InfoItem>

                <InfoItem>
                  <InfoIcon>
                    <IconUsers size={20} />
                  </InfoIcon>
                  <InfoContent>
                    <InfoLabel>Số người</InfoLabel>
                    <InfoValue>
                      {(booking.numberOfAdult || 0) + (booking.numberOfChild || 0) + (booking.numberOfBaby || 0)} người
                      {booking.numberOfAdult && ` (${booking.numberOfAdult} người lớn)`}
                      {booking.numberOfChild && `, ${booking.numberOfChild} trẻ em`}
                      {booking.numberOfBaby && `, ${booking.numberOfBaby} em bé`}
                    </InfoValue>
                  </InfoContent>
                </InfoItem>

                <InfoItem>
                  <InfoIcon>
                    <IconCoin size={20} />
                  </InfoIcon>
                  <InfoContent>
                    <InfoLabel>Tổng giá tiền</InfoLabel>
                    <InfoValue>
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(booking.totalCost || 0)}
                    </InfoValue>
                  </InfoContent>
                </InfoItem>
              </InfoGrid>

              <CustomerInfo>
                <CustomerRow>
                  <CustomerLabel>Tên khách hàng:</CustomerLabel>
                  <CustomerValue>{booking.fullName}</CustomerValue>
                </CustomerRow>
                <CustomerRow>
                  <CustomerLabel>Email:</CustomerLabel>
                  <CustomerValue>{booking.email}</CustomerValue>
                </CustomerRow>
                <CustomerRow>
                  <CustomerLabel>Số điện thoại:</CustomerLabel>
                  <CustomerValue>{booking.phone}</CustomerValue>
                </CustomerRow>
                <CustomerRow>
                  <CustomerLabel>Địa chỉ:</CustomerLabel>
                  <CustomerValue>{booking.address}</CustomerValue>
                </CustomerRow>
                {booking.note && (
                  <CustomerRow>
                    <CustomerLabel>Ghi chú:</CustomerLabel>
                    <CustomerValue>{booking.note}</CustomerValue>
                  </CustomerRow>
                )}
                <CustomerRow>
                  <CustomerLabel>Phương thức thanh toán:</CustomerLabel>
                  <CustomerValue>
                    {booking.paymentMethod === 'card' && 'Thẻ tín dụng'}
                    {booking.paymentMethod === 'bank' && 'Chuyển khoản'}
                    {booking.paymentMethod === 'cash' && 'Thanh toán tại chỗ'}
                  </CustomerValue>
                </CustomerRow>
              </CustomerInfo>

              <Actions>
                <ActionButton onClick={() => handleCancelBooking(booking.id)} className="delete">
                  <IconTrash size={16} style={{ marginRight: '4px' }} />
                  Hủy booking
                </ActionButton>
              </Actions>

              {/* Đánh giá & Bình luận */}
              <CommentsSection>
                <CommentsTitle>⭐ Đánh giá & Bình luận</CommentsTitle>
                
                <CommentsTabs>
                  <CommentTab active>Đánh giá</CommentTab>
                  <CommentTab>Bình luận</CommentTab>
                </CommentsTabs>

                {/* Form Đánh giá */}
                <RatingSection>
                  <RatingLabel>Hãy chia sẻ trải nghiệm của bạn</RatingLabel>
                  <RatingForm onSubmit={async (e) => {
                      e.preventDefault();
                      const form = e.target;
                      const formData = new FormData(form);
                      const comment = formData.get('comment') || '';
                      const rating = parseInt(formData.get('rating')) || 0;
                      // try to detect tourId from booking object
                      const tourId = booking.tourId || booking.tour && booking.tour.id || booking.tourId;

                      if (!tourId) {
                        alert('Không xác định được tourId để gửi đánh giá');
                        return;
                      }

                      try {
                        await api.post('/comments', {
                          tourId,
                          content: comment,
                          rating
                        });
                        alert('Gửi đánh giá thành công');
                        // Ideally refresh comments list here
                      } catch (err) {
                        console.error('Error submitting comment', err);
                        alert('Lỗi khi gửi đánh giá');
                      }
                    }}>
                      <div>
                        <RatingLabel style={{marginTop: '8px'}}>Xếp hạng</RatingLabel>
                        <RatingStars>
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star key={star} type="button" onClick={(ev)=>{ ev.preventDefault(); const f = ev.currentTarget.closest('form'); const input = f.querySelector('input[name="rating"]'); if(input) input.value = star; }}>
                              <IconStar size={24} />
                            </Star>
                          ))}
                        </RatingStars>
                        <input type="hidden" name="rating" defaultValue="5" />
                      </div>
                      <div>
                        <RatingLabel>Tiêu đề</RatingLabel>
                        <RatingInput name="title" type="text" placeholder="Vd: Tour tuyệt vời!" />
                      </div>
                      <div>
                        <RatingLabel>Nhận xét chi tiết</RatingLabel>
                        <RatingTextarea name="comment" placeholder="Chia sẻ trải nghiệm của bạn về tour này..." required />
                      </div>
                      <RatingButton type="submit">Gửi đánh giá</RatingButton>
                    </RatingForm>
                </RatingSection>

                {/* Danh sách Đánh giá */}
                <CommentsList>
                  <CommentCard>
                    <CommentHeader>
                      <CommentAuthor>Nguyễn Văn A</CommentAuthor>
                      <CommentDate>2 ngày trước</CommentDate>
                    </CommentHeader>
                    <CommentRating>
                      {[1, 2, 3, 4, 5].map(i => (
                        <IconStar key={i} size={16} style={{ color: i <= 5 ? '#ffc107' : '#ddd', fill: i <= 5 ? '#ffc107' : 'none' }} />
                      ))}
                    </CommentRating>
                    <CommentText>
                      <strong>Tour tuyệt vời!</strong><br />
                      Hướng dẫn viên rất chuyên nghiệp, khách sạn sạch sẽ, đồ ăn ngon. Tôi rất hài lòng với tour này. Sẽ quay lại lần nữa.
                    </CommentText>
                  </CommentCard>

                  <CommentCard>
                    <CommentHeader>
                      <CommentAuthor>Trần Thị B</CommentAuthor>
                      <CommentDate>1 tuần trước</CommentDate>
                    </CommentHeader>
                    <CommentRating>
                      {[1, 2, 3, 4, 5].map(i => (
                        <IconStar key={i} size={16} style={{ color: i <= 4 ? '#ffc107' : '#ddd', fill: i <= 4 ? '#ffc107' : 'none' }} />
                      ))}
                    </CommentRating>
                    <CommentText>
                      <strong>Đáng tiền!</strong><br />
                      Giá cả hợp lý, lịch trình chi tiết, tất cả các điểm tham quan đều thú vị. Không có gì phàn nàn cả.
                    </CommentText>
                  </CommentCard>
                </CommentsList>
              </CommentsSection>
            </BookingCard>
          ))}
        </BookingList>
      )}

      {/* Global / bottom comment box - appears below bookings */}
      {bookings.length > 0 && (
        <BottomCommentSection>
          <CommentsTitle>Gửi đánh giá / bình luận cho tour</CommentsTitle>
          <BottomForm onSubmit={handleSubmitGlobalComment}>
            <BottomSelect value={selectedTourForComment || ''} onChange={(e) => setSelectedTourForComment(e.target.value)}>
              {bookings.map(b => (
                <option key={`${b.userId}-${b.tourId}`} value={b.tourId}>{b.tourName || `Tour ${b.tourId}`}</option>
              ))}
            </BottomSelect>
            <BottomTextarea value={globalComment} onChange={(e)=>setGlobalComment(e.target.value)} placeholder="Viết nhận xét của bạn..." />
            <BottomSelect value={globalRating} onChange={(e)=>setGlobalRating(parseInt(e.target.value))}>
              {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} sao</option>)}
            </BottomSelect>
            <RatingButton type="submit">Gửi</RatingButton>
          </BottomForm>
        </BottomCommentSection>
      )}
    </Container>
  );
};

export default BookingProfilePage;
