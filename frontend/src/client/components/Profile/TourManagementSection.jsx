import React, { useEffect, useState } from "react";
import styled from "styled-components";
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
	gap: 12px;
`;

const Item = styled.div`
	display: flex;
	gap: 12px;
	align-items: center;
	padding: 12px;
	border-radius: 10px;
	background: #fafafa;
	box-shadow: 0 4px 12px rgba(0,0,0,0.03);
`;

const Thumb = styled.img`
	width: 120px;
	height: 72px;
	object-fit: cover;
	border-radius: 8px;
`;

const TitleCol = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 6px;
`;

const Actions = styled.div`
	display: flex;
	gap: 8px;
`;

const Btn = styled.button`
	padding: 8px 12px;
	border-radius: 8px;
	border: none;
	cursor: pointer;
	font-weight: 600;
`;

const EditBtn = styled(Btn)`
	background: #0d6efd;
	color: white;
`;

const DeleteBtn = styled(Btn)`
	background: #ef4444;
	color: white;
`;

export default function TourManagementSection() {
	const [tours, setTours] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchMyTours = async () => {
			try {
				const res = await api.get(`/tours/my`);
				if (res.data?.success) setTours(res.data.data || mockMyTours);
				else setTours(mockMyTours);
			} catch (err) {
				setTours(mockMyTours);
			} finally {
				setLoading(false);
			}
		};

		fetchMyTours();
	}, []);

	const handleDelete = (id) => {
		if (!window.confirm('Xóa tour này sẽ vĩnh viễn. Tiếp tục?')) return;
		setTours(prev => prev.filter(t => t.id !== id));
		api.delete(`/tours/${id}`).catch(()=>{});
	};

	const handleEdit = (id) => {
		alert('Chức năng chỉnh sửa demo — chuyển sang trang chỉnh sửa: ' + id);
		// Here you would navigate to edit page or open modal
	};

	if (loading) return <Container><Title>Quản lý Tour</Title><div>Loading...</div></Container>;

	return (
		<Container>
			<Title>Quản lý Tour</Title>
			{tours.length === 0 ? (
				<div>Bạn chưa có tour nào.</div>
			) : (
				<List>
					{tours.map(t => (
						<Item key={t.id}>
							<Thumb src={t.thumbnailUrl || t.image} alt={t.name} />
							<TitleCol>
								<div style={{fontWeight:700}}>{t.name}</div>
								<div style={{color:'#666', fontSize:13}}>{t.shortDescription}</div>
							</TitleCol>
							<Actions>
								<EditBtn onClick={() => handleEdit(t.id)}>Edit</EditBtn>
								<DeleteBtn onClick={() => handleDelete(t.id)}>Delete</DeleteBtn>
							</Actions>
						</Item>
					))}
				</List>
			)}
		</Container>
	);
}

const mockMyTours = [
	{
		id: 201,
		name: 'Tour Sài Gòn - Cần Thơ',
		thumbnailUrl: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80',
		shortDescription: 'Khám phá miền Tây sông nước.'
	},
	{
		id: 202,
		name: 'Tour Phú Quốc 3N2Đ',
		thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
		shortDescription: 'Nghỉ dưỡng trên hòn đảo thiên đường.'
	}
];

