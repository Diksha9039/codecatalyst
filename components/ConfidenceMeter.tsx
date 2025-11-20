import React from 'react';

interface ConfidenceMeterProps {
  score: number;
}

const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({ score }) => {
  const getColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-blue-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getLabel = (score: number) => {
    if (score >= 90) return 'Highly Reliable';
    if (score >= 70) return 'Good Confidence';
    if (score >= 50) return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ease-out ${getColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="flex flex-col items-end min-w-[100px]">
        <span className="text-sm font-bold text-slate-700">{score}%</span>
        <span className="text-xs text-slate-500">{getLabel(score)}</span>
      </div>
    </div>
  );
};

export default ConfidenceMeter;
