import React from 'react';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

type AlertType = 'success' | 'error' | 'info' | 'warning';

interface AlertProps {
  type?: AlertType;
  title?: string;
  message: string;
  className?: string;
}

const styles = {
  success: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-400',
    icon: CheckCircle2,
  },
  error: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    text: 'text-red-400',
    icon: XCircle,
  },
  warning: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    text: 'text-amber-400',
    icon: AlertCircle,
  },
  info: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    text: 'text-blue-400',
    icon: Info,
  },
};

export const Alert: React.FC<AlertProps> = ({ type = 'info', title, message, className = '' }) => {
  const config = styles[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex gap-3 p-4 rounded-xl border backdrop-blur-sm ${config.bg} ${config.border} ${className}`}
    >
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${config.text}`} />
      <div className="flex flex-col">
        {title && <h4 className={`font-semibold text-sm ${config.text}`}>{title}</h4>}
        <p className={`text-sm ${title ? 'text-neutral-300 mt-1' : config.text}`}>{message}</p>
      </div>
    </motion.div>
  );
};
