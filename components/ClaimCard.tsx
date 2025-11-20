import React from 'react';
import { Claim, Classification } from '../types';
import { CheckCircle2, XCircle, AlertTriangle, HelpCircle, AlertOctagon } from 'lucide-react';
import ConfidenceMeter from './ConfidenceMeter';

interface ClaimCardProps {
  claimData: Claim;
}

const ClaimCard: React.FC<ClaimCardProps> = ({ claimData }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case Classification.TRUE:
        return {
          icon: <CheckCircle2 className="w-6 h-6 text-green-600" />,
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          badge: 'bg-green-100 text-green-800'
        };
      case Classification.FALSE:
        return {
          icon: <XCircle className="w-6 h-6 text-red-600" />,
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          badge: 'bg-red-100 text-red-800'
        };
      case Classification.MISLEADING:
        return {
          icon: <AlertTriangle className="w-6 h-6 text-orange-600" />,
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          text: 'text-orange-800',
          badge: 'bg-orange-100 text-orange-800'
        };
      case Classification.PARTIALLY_TRUE:
        return {
          icon: <AlertOctagon className="w-6 h-6 text-yellow-600" />,
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          badge: 'bg-yellow-100 text-yellow-800'
        };
      default:
        return {
          icon: <HelpCircle className="w-6 h-6 text-slate-600" />,
          bg: 'bg-slate-50',
          border: 'border-slate-200',
          text: 'text-slate-800',
          badge: 'bg-slate-100 text-slate-800'
        };
    }
  };

  const config = getStatusConfig(claimData.classification);

  return (
    <div className={`rounded-xl border ${config.border} ${config.bg} p-5 mb-4 transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">
          {config.icon}
        </div>
        
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold text-slate-900 text-lg leading-tight">
              {claimData.claim}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${config.badge}`}>
              {claimData.classification}
            </span>
          </div>

          <div className="space-y-2">
            <div className="p-3 bg-white/60 rounded-lg border border-white/50">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-1">Analysis</p>
              <p className="text-slate-700 text-sm leading-relaxed">
                {claimData.explanation}
              </p>
            </div>

            {claimData.correction && claimData.classification !== Classification.TRUE && (
              <div className="p-3 bg-white/60 rounded-lg border border-white/50">
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-1">Correction</p>
                <p className="text-slate-700 text-sm leading-relaxed">
                  {claimData.correction}
                </p>
              </div>
            )}
          </div>

          <div className="pt-2">
             <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Confidence Score</p>
            <ConfidenceMeter score={claimData.confidence} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimCard;
