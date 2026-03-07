import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ApplyToGig: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      navigate(`/gig/${id}`);
    } else {
      navigate('/browse');
    }
  }, [id, navigate]);

  return null;
};

export default ApplyToGig;
