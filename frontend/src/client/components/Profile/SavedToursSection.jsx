import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
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

const Grid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
	gap: 16px;
`;

const Card = styled.div`
	border-radius: 10px;
	overflow: hidden;
	background: #fff;
	box-shadow: 0 6px 18px rgba(0,0,0,0.05);
	display: flex;
	flex-direction: column;
`;

const Thumb = styled.img`
	width: 100%;
	height: 140px;
	object-fit: cover;
`;

const CardBody = styled.div`
	padding: 12px;
	display: flex;
	flex-direction: column;
	gap: 8px;
	flex: 1;
`;

const Name = styled.div`
	font-weight: 700;
	color: #222;
`;

const Desc = styled.div`
	color: #666;
	font-size: 13px;
	flex: 1;
`;

const Row = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 8px;
`;

const ActionButton = styled.button`
	padding: 8px 12px;
	background: #ef4444;
	color: white;
	border: none;
	border-radius: 8px;
	cursor: pointer;
	font-weight: 600;

	&:hover { opacity: 0.95 }
`;

export default function SavedToursSection() {
	const [savedTours, setSavedTours] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const fetchSaved = async () => {
		try {
			const token = localStorage.getItem('token');
			if (!token) {
				setLoading(false);
				return;
			}

			const res = await api.get(`/users/saved-tours`);
			if (res.data?.success) {
				setSavedTours(res.data.data || []);
			} else {
				setSavedTours([]);
			}
		} catch (err) {
			console.log('Error fetching saved tours:', err);
			if (err.response?.status === 401) {
				// Token expired or invalid
				setSavedTours([]);
			} else {
				setSavedTours([]);
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchSaved();
	}, []);

	const handleUnsave = async (id) => {
		if (!window.confirm('Bạn có chắc muốn bỏ lưu tour này?')) return;
		
		const token = localStorage.getItem('token');
		if (!token) {
			alert('Vui lòng đăng nhập');
			return;
		}

		// Optimistic update
		setSavedTours(prev => prev.filter(t => t.id !== id));

		try {
			await api.delete(`/users/saved-tours/${id}`);
		} catch (err) {
			console.log('Error unsaving tour:', err);
			// Revert on error - refetch saved tours
			if (err.response?.status === 401) {
				alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
			}
			fetchSaved();
		}
	};

	if (loading) return <Container><Title>Đã lưu</Title><div>Loading...</div></Container>;

	if (!savedTours || savedTours.length === 0) return (
		<Container>
			<Title>Đã lưu</Title>
			<div>Bạn chưa lưu tour nào.</div>
		</Container>
	);

	return (
		<Container>
			<Title>Đã lưu</Title>
			<Grid>
				{savedTours.map(tour => (
					<Card key={tour.id}>
						<Link to={`/tour/${tour.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
							<Thumb src={tour.thumbnailUrl || tour.image || ''} alt={tour.name || tour.shortDescription} />
						</Link>
						<CardBody>
							<Link to={`/tour/${tour.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
								<Name>{tour.name || tour.shortDescription || 'Tour du lịch'}</Name>
								<Desc>{tour.shortDescription || tour.description || ''}</Desc>
							</Link>
							<Row>
								<div style={{fontWeight:700, color: '#ff4757'}}>
									{tour.price ? new Intl.NumberFormat('vi-VN', {
										style: 'currency',
										currency: 'VND'
									}).format(tour.price) : 'Đang cập nhật'}
								</div>
								<ActionButton onClick={() => handleUnsave(tour.id)}>Bỏ lưu</ActionButton>
							</Row>
						</CardBody>
					</Card>
				))}
			</Grid>
		</Container>
	);
}


