import { FeedbackState } from './FeedbackState';

type Props = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title, description, actionLabel, onAction }: Props) {
  return (
    <FeedbackState
      title={title}
      description={description}
      variant="empty"
      actionLabel={actionLabel}
      onAction={onAction}
    />
  );
}
