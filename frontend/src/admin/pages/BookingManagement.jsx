import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { IconSearch, IconEdit, IconTrash, IconEye, IconDownload } from '@tabler/icons-react';
import api from '../../api/api';
import Alert from '../components/Alert';
import ConfirmModal from '../components/ConfirmModal';
import LoadingComponent from '../components/LoadingComponent';

const Container = styled.div`
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background: white;
  padding: 20px;
  border-radius: 8px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 28px;
  color: #333;
`;

const SearchBar = styled.div`
  display: flex;
  gap: 12px;
  flex: 1;
  max-width: 400px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 10px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #ff6b35;
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
  }
`;

const Table = styled.table`
  width: 100%;
  background: white;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const TableHead = styled.thead`
  background: #f9f9f9;
  border-bottom: 2px solid #e0e0e0;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #e0e0e0;
  
  &:hover {
    background: #fafafa;
  }
`;

const TableHeader = styled.th`
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: #333;
  font-size: 14px;
`;

const TableCell = styled.td`
  padding: 16px;
  font-size: 14px;
  color: #666;
`;

const Status = styled.span`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    if (props.status === 'pending') return '#fff3cd';
    if (props.status === 'confirmed') return '#d4edda';
    if (props.status === 'completed') return '#cfe2ff';
    if (props.status === 'cancelled') return '#f8d7da';
    return '#e2e3e5';
  }};
  color: ${props => {
    if (props.status === 'pending') return '#856404';
    if (props.status === 'confirmed') return '#155724';
    if (props.status === 'completed') return '#004085';
    if (props.status === 'cancelled') return '#721c24';
    return '#383d41';
  }};
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 8px 12px;
  border: none;
  background: ${props => props.variant === 'danger' ? '#f44336' : '#ff6b35'};
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s;

  &:hover {
    background: ${props => props.variant === 'danger' ? '#e53935' : '#e55a1f'};
  }
`;

const Filters = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 8px 16px;
  border: 1px solid ${props => props.active ? '#ff6b35' : '#ddd'};
  background: ${props => props.active ? '#ff6b35' : 'white'};
  color: ${props => props.active ? 'white' : '#666'};
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;

  &:hover {
    border-color: #ff6b35;
  }
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  h3 {
    margin: 0 0 8px 0;
    font-size: 14px;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .value {
    font-size: 32px;
    font-weight: 700;
    color: #ff6b35;
  }
`;

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [confirmModal, setConfirmModal] = useState({ show: false, bookingId: null });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/bookings');
      setBookings(response.data?.data || []);
      setError(null);
    } catch (err) {
      setError('Không thể tải danh sách booking');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      await api.delete(`/bookings/${bookingId}`);
      setBookings(bookings.filter(b => b.id !== bookingId));
      setConfirmModal({ show: false, bookingId: null });
    } catch (err) {
      setError('Lỗi khi xóa booking');
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await api.put(`/bookings/${bookingId}`, { status: newStatus });
      setBookings(bookings.map(b => 
        b.id === bookingId ? { ...b, status: newStatus } : b
      ));
    } catch (err) {
      setError('Lỗi khi cập nhật trạng thái');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchSearch = !searchTerm || 
      booking.tourName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchSearch && matchStatus;
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
  };

  if (loading) return <LoadingComponent />;

  return (
    <Container>
      {error && <Alert type="error" message={error} />}

      <Header>
        <div>
          <Title>Quản Lý Booking</Title>
        </div>
        <SearchBar>
          <SearchInput
            type="text"
            placeholder="Tìm kiếm tour, khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ActionButton>
            <IconSearch size={18} />
            Tìm
          </ActionButton>
        </SearchBar>
      </Header>

      <Stats>
        <StatCard>
          <h3>Tổng Booking</h3>
          <div className="value">{stats.total}</div>
        </StatCard>
        <StatCard>
          <h3>Chờ Xác Nhận</h3>
          <div className="value" style={{ color: '#ffc107' }}>{stats.pending}</div>
        </StatCard>
        <StatCard>
          <h3>Đã Xác Nhận</h3>
          <div className="value" style={{ color: '#4caf50' }}>{stats.confirmed}</div>
        </StatCard>
        <StatCard>
          <h3>Hoàn Thành</h3>
          <div className="value" style={{ color: '#2196f3' }}>{stats.completed}</div>
        </StatCard>
      </Stats>

      <div style={{ background: 'white', borderRadius: '8px', padding: '20px' }}>
        <Filters>
          <FilterButton 
            active={statusFilter === 'all'} 
            onClick={() => setStatusFilter('all')}
          >
            Tất Cả ({stats.total})
          </FilterButton>
          <FilterButton 
            active={statusFilter === 'pending'} 
            onClick={() => setStatusFilter('pending')}
          >
            Chờ Xác Nhận ({stats.pending})
          </FilterButton>
          <FilterButton 
            active={statusFilter === 'confirmed'} 
            onClick={() => setStatusFilter('confirmed')}
          >
            Đã Xác Nhận ({stats.confirmed})
          </FilterButton>
          <FilterButton 
            active={statusFilter === 'completed'} 
            onClick={() => setStatusFilter('completed')}
          >
            Hoàn Thành ({stats.completed})
          </FilterButton>
        </Filters>

        <div style={{ overflowX: 'auto', marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Mã Booking</TableHeader>
                <TableHeader>Tour</TableHeader>
                <TableHeader>Khách Hàng</TableHeader>
                <TableHeader>Ngày Xuất Phát</TableHeader>
                <TableHeader>Người</TableHeader>
                <TableHeader>Giá</TableHeader>
                <TableHeader>Trạng Thái</TableHeader>
                <TableHeader>Hành Động</TableHeader>
              </TableRow>
            </TableHead>
            <tbody>
              {filteredBookings.map(booking => (
                <TableRow key={booking.id}>
                  <TableCell>#{booking.id}</TableCell>
                  <TableCell>
                    <strong>{booking.tourName || 'N/A'}</strong>
                  </TableCell>
                  <TableCell>{booking.fullName}</TableCell>
                  <TableCell>{new Date(booking.startDate).toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell>
                    {(booking.numberOfAdult || 0) + (booking.numberOfChild || 0) + (booking.numberOfBaby || 0)}
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(booking.totalCost || 0)}
                  </TableCell>
                  <TableCell>
                    <Status status={booking.status || 'pending'}>
                      {booking.status === 'pending' && 'Chờ Xác Nhận'}
                      {booking.status === 'confirmed' && 'Đã Xác Nhận'}
                      {booking.status === 'completed' && 'Hoàn Thành'}
                      {booking.status === 'cancelled' && 'Đã Hủy'}
                    </Status>
                  </TableCell>
                  <TableCell>
                    <Actions>
                      <ActionButton>
                        <IconEye size={14} />
                      </ActionButton>
                      <ActionButton>
                        <IconEdit size={14} />
                      </ActionButton>
                      <ActionButton 
                        variant="danger"
                        onClick={() => setConfirmModal({ show: true, bookingId: booking.id })}
                      >
                        <IconTrash size={14} />
                      </ActionButton>
                    </Actions>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </div>

        {filteredBookings.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            Không có booking nào
          </div>
        )}
      </div>

      {confirmModal.show && (
        <ConfirmModal
          title="Xác Nhận Xóa"
          message="Bạn có chắc chắn muốn xóa booking này?"
          onConfirm={() => handleDeleteBooking(confirmModal.bookingId)}
          onCancel={() => setConfirmModal({ show: false, bookingId: null })}
        />
      )}
    </Container>
  );
};

export default BookingManagement;
