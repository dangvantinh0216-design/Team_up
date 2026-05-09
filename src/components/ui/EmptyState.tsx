import React from 'react';
import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: string;
  actionText?: string;
  actionHref?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = '📁',
  actionText,
  actionHref,
}) => {
  return (
    <div className="empty-state-container animate-fade-in">
      <div className="empty-state-icon">{icon}</div>
      <h3>{title}</h3>
      <p style={{ maxWidth: '400px', marginBottom: 'var(--spacing-lg)' }}>
        {description}
      </p>
      {actionText && actionHref && (
        <Link href={actionHref} className="btn btn-primary">
          {actionText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
