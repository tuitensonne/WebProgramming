import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { IconUsers, IconCoin, IconTrash } from '@tabler/icons-react';
import api from "../../../api/api";

const Container = styled.div`
	background: white;
	border-radius: 12px;
	padding: 24px;
	box-shadow: 0 1px 3px rgba(0,0,0,0.06);
`;

const Title = styled.h2`
	font-size: 20px;
	font-weight: 600;
	margin-bottom: 16px;
`;

const List = styled.div`
	display: grid;
	gap: 16px;
`;

const Item = styled.div`
	padding: 16px;
	border-radius: 10px;
	background: #fafafa;
	box-shadow: 0 2px 8px rgba(0,0,0,0.05);
	border: 1px solid #e0e0e0;
`;

const ItemHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: start;
	margin-bottom: 12px;
`;

const TourName = styled.div`
	font-weight: 700;
	font-size: 16px;
	color: #333;
	margin-bottom: 4px;
`;

const BookingId = styled.div`
	font-size: 12px;
	color: #999;
`;

const Status = styled.span`
	display: inline-block;
	padding: 4px 10px;
	border-radius: 12px;
	font-size: 11px;
	font-weight: 600;
	background: ${props => {
		if (props.status === 'pending') return '#ffd700';
		if (props.status === 'confirmed') return '#4caf50';
		if (props.status === 'cancelled') return '#f44336';
		return '#2196f3';
	}};
	color: white;
`;

const InfoGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
	gap: 12px;
	margin-bottom: 12px;
`;

const InfoItem = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 13px;
`;

const InfoIcon = styled.div`
	color: #ff6b35;
	display: flex;
	align-items: center;
`;

const InfoText = styled.div`
	color: #666;
`;

const Actions = styled.div`
	display: flex;
	gap: 8px;
	justify-content: flex-end;
	margin-top: 12px;
	padding-top: 12px;
	border-top: 1px solid #e0e0e0;
`;

const DeleteBtn = styled.button`
	padding: 6px 12px;
	border-radius: 6px;
	border: 1px solid #f44336;
	background: white;
	color: #f44336;
	cursor: pointer;
	font-weight: 600;
	font-size: 12px;
	display: flex;
	align-items: center;
	gap: 4px;
	transition: all 0.2s;
	
	&:hover {
		background: #ffebee;
	}
`;

const EmptyState = styled.div`
	text-align: center;
	padding: 40px 20px;
	color: #999;
`;

export default function TourManagementSection({ isActive }) {
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchBookings = async () => {
		try {
			setLoading(true);
			setError(null);
			const response = await api.get('/bookings/my-bookings');
			console.log('Bookings API response:', response);
			console.log('Response data:', response.data);
			
			// Handle different response formats
			let bookingsData = [];
			if (response.data) {
				if (response.data.success !== false && response.data.data) {
					// Standard format: { success: true, data: [...] }
					bookingsData = response.data.data;
				} else if (Array.isArray(response.data)) {
					// Direct array response
					bookingsData = response.data;
				} else if (response.data.data && Array.isArray(response.data.data)) {
					// Nested data
					bookingsData = response.data.data;
				}
			}
			
			console.log('Parsed bookings:', bookingsData);
			setBookings(Array.isArray(bookingsData) ? bookingsData : []);
		} catch (err) {
			console.error('Error fetching bookings:', err);
			console.error('Error response:', err.response);
			const errorMsg = err.response?.data?.message || err.message || 'Không thể tải danh sách booking';
			setError(errorMsg);
			setBookings([]);
		} finally {
			setLoading(false);
		}
	};

	// Fetch bookings when component mounts
	useEffect(() => {
		fetchBookings();
	}, []);

	// Fetch bookings again when section becomes active (e.g., after booking)
	useEffect(() => {
		if (isActive) {
			fetchBookings();
		}
	}, [isActive]);

	const handleCancel = async (userId, tourId) => {
		if (!window.confirm('Bạn chắc chắn muốn hủy booking này?')) return;
		try {
			// API expects userId and tourId for delete
			if (!userId) {
				alert('Không tìm thấy thông tin user');
				return;
			}
			await api.delete(`/bookings?userId=${userId}&tourId=${tourId}`);
			setBookings(bookings.filter(b => !(b.userId === userId && b.tourId === tourId)));
			alert('Hủy booking thành công');
			// Refresh bookings after cancel
			fetchBookings();
		} catch (err) {
			console.error('Error cancelling booking:', err);
			alert('Lỗi khi hủy booking: ' + (err.response?.data?.message || err.message));
		}
	};

	if (loading) {
		return (
			<Container>
				<Title>Quản lý Tour đã đặt</Title>
				<div>Đang tải...</div>
			</Container>
		);
	}

	if (error) {
		return (
			<Container>
				<Title>Quản lý Tour đã đặt</Title>
				<div style={{ color: '#f44336' }}>{error}</div>
			</Container>
		);
	}

	return (
		<Container>
			<Title>Quản lý Tour đã đặt</Title>
			{bookings.length === 0 ? (
				<EmptyState>
					<p>Bạn chưa có booking nào.</p>
					<p style={{ fontSize: '13px', marginTop: '8px' }}>
						Hãy tìm và đặt tour yêu thích của bạn
					</p>
				</EmptyState>
			) : (
				<List>
					{bookings.map(booking => (
						<Item key={`${booking.userId}-${booking.tourId}`}>
							<ItemHeader>
								<div>
									<TourName>{booking.tourName || 'Tour'}</TourName>
									<BookingId>Tour ID: #{booking.tourId}</BookingId>
								</div>
								<Status status={booking.status || 'pending'}>
									{booking.status === 'pending' && 'Chờ xác nhận'}
									{booking.status === 'confirmed' && 'Đã xác nhận'}
									{booking.status === 'cancelled' && 'Đã hủy'}
									{booking.status === 'completed' && 'Hoàn thành'}
								</Status>
							</ItemHeader>

							<InfoGrid>
								<InfoItem>
									<InfoIcon>
										<IconUsers size={16} />
									</InfoIcon>
									<InfoText>
										<strong>Số người lớn:</strong> {booking.numberOfAdult || 0}
									</InfoText>
								</InfoItem>
								<InfoItem>
									<InfoIcon>
										<IconUsers size={16} />
									</InfoIcon>
									<InfoText>
										<strong>Số trẻ em:</strong> {booking.numberOfChild || 0}
									</InfoText>
								</InfoItem>
								<InfoItem>
									<InfoIcon>
										<IconUsers size={16} />
									</InfoIcon>
									<InfoText>
										<strong>Tổng số người:</strong> {(booking.numberOfAdult || 0) + (booking.numberOfChild || 0)}
									</InfoText>
								</InfoItem>
								<InfoItem>
									<InfoIcon>
										<IconCoin size={16} />
									</InfoIcon>
									<InfoText>
										<strong>Tổng tiền:</strong> {new Intl.NumberFormat('vi-VN', {
											style: 'currency',
											currency: 'VND'
										}).format(booking.totalCost || 0)}
									</InfoText>
								</InfoItem>
							</InfoGrid>

							{booking.status === 'pending' && (
								<Actions>
									<DeleteBtn onClick={() => handleCancel(booking.userId, booking.tourId)}>
										<IconTrash size={14} />
										Hủy booking
									</DeleteBtn>
								</Actions>
							)}
						</Item>
					))}
				</List>
			)}
		</Container>
	);
}

