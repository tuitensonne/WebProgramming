import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CategoryRedirect = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const cid = parseInt(id, 10);
    if (isNaN(cid)) {
      navigate('/tour-types');
      return;
    }

    // Map category ids
    const domestic = [1, 5];
    const international = [2, 6];

    if (domestic.includes(cid)) {
      navigate(`/domestic?category=${cid}`, { replace: true });
    } else if (international.includes(cid)) {
      navigate(`/international?category=${cid}`, { replace: true });
    } else {
      navigate(`/tour-types?category=${cid}`, { replace: true });
    }
  }, [id, navigate]);

  return null;
};

export default CategoryRedirect;
