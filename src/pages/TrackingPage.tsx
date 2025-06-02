import React from 'react';
import { useParams } from 'react-router-dom';
import MissionTracker from '@/components/tracking/MissionTracker';

const TrackingPage: React.FC = () => {
  const { missionId } = useParams<{ missionId: string }>();

  if (!missionId) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">ID de mission manquant</p>
      </div>
    );
  }

  return <MissionTracker missionId={missionId} />;
};

export default TrackingPage;

