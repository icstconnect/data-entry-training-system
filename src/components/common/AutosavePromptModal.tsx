import React from 'react';
import { History, Play, Trash2 } from 'lucide-react';
import { StageDraft } from '../../services/storageService';

interface AutosavePromptModalProps {
  draft: StageDraft;
  onResume: () => void;
  onDiscard: () => void;
}

export const AutosavePromptModal: React.FC<AutosavePromptModalProps> = ({
  draft,
  onResume,
  onDiscard
}) => {
  const savedDate = new Date(draft.savedAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={18} color="var(--icst-blue)" />
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Resume Previous Attempt?</h3>
          </div>
        </div>

        <div className="modal-body" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          <p style={{ marginBottom: '12px' }}>
            We detected an uncompleted draft for <strong>Level {draft.levelNumber}, Stage {draft.stageNumber}</strong> with UID <code style={{ fontFamily: 'var(--font-mono)', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>{draft.uid}</code> saved at <strong>{savedDate}</strong>.
          </p>
          <p>
            Would you like to resume your previous entries or start a fresh session?
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onDiscard}
          >
            <Trash2 size={14} />
            <span>START NEW</span>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onResume}
            autoFocus
          >
            <Play size={14} />
            <span>RESUME</span>
          </button>
        </div>
      </div>
    </div>
  );
};
