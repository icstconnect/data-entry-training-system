import React, { useState } from 'react';
import { StageConfig } from '../../types';
import { Target, Award, CheckCircle2, ArrowRight, Languages } from 'lucide-react';

interface StageInstructionsModalProps {
  stage: StageConfig;
  onStart: () => void;
}

// Bengali translations for standard practice lab instructions
const INSTRUCTION_TRANSLATIONS_BN: Record<string, string> = {
  'Enter the assigned UID in the reference lookup bar to load the source student file.':
    'সোর্স স্টুডেন্ট ফাইল লোড করার জন্য রেফারেন্স লুকআপ বারে নির্ধারিত UID টাইপ করুন।',
  'Carefully transcribe student personal details into the matching fields.':
    'সংশ্লিষ্ট ঘরগুলোতে শিক্ষার্থীর ব্যক্তিগত তথ্য অত্যন্ত সতর্কতার সাথে টাইপ করুন।',
  'Ensure the date format is YYYY-MM-DD.':
    'তারিখের ফরম্যাট যেন অবশ্যই YYYY-MM-DD (বছর-মাস-দিন) হয় তা নিশ্চিত করুন।',
  'Use the Review button to verify your entries before clicking Final Submit.':
    'চূড়ান্ত সাবমিটের আগে রিভিউ (Review) বোতাম চেপে আপনার টাইপ করা তথ্য মিলিয়ে নিন।',
  'Maintain at least the required target accuracy to clear this stage.':
    'এই পর্যায় উত্তীর্ণ হওয়ার জন্য নির্ধারিত লক্ষ্যমাত্রার নির্ভুলতা (Accuracy) বজায় রাখুন।',
  'Transcribe secondary guardian and emergency contact details accurately.':
    'অভিভাবকের বিস্তারিত বিবরণ ও জরুরি যোগাযোগের ফোন নম্বর নির্ভুলভাবে টাইপ করুন।',
  'Select appropriate options for blood group and relationship status.':
    'রক্তের গ্রুপ ও সম্পর্কের তালিকায় থাকা সঠিক ড্রপডাউন অপশন নির্বাচন করুন।',
  'Tab through form fields quickly without using mouse.':
    'কাজের গতি বাড়াতে মাউস না ছুঁয়ে ট্যাব (Tab) বা এন্টার (Enter) চেপে ঘরে ঘরে যান।',
  'Cross-verify numerical roll numbers and identification codes.':
    'রোল নম্বর ও সনাক্তকরণ কোডের প্রতিটি সংখ্যা মূল নথির সাথে মিলিয়ে নিন।',
  'Ensure uppercase formatting where required for official codes.':
    'অফিসিয়াল কোডের ক্ষেত্রে বড় হাতের অক্ষর (Uppercase) নিশ্চিত করুন।'
};

function getBengaliInstruction(enText: string): string {
  if (INSTRUCTION_TRANSLATIONS_BN[enText]) {
    return INSTRUCTION_TRANSLATIONS_BN[enText];
  }
  // Generic translation if exact match not found
  if (enText.toLowerCase().includes('uid')) {
    return 'রেফারেন্স লুকআপ বারে নির্ধারিত UID লিখে সোর্স রেকর্ড লোড করুন।';
  }
  if (enText.toLowerCase().includes('date') || enText.toLowerCase().includes('dob')) {
    return 'তারিখ লেখার সময় সঠিক ফরম্যাট (YYYY-MM-DD) বজায় রাখুন।';
  }
  if (enText.toLowerCase().includes('review') || enText.toLowerCase().includes('submit')) {
    return 'চূড়ান্ত সাবমিটের পূর্বে রিভিউ বোতামে ক্লিক করে ডেটা যাচাই করুন।';
  }
  if (enText.toLowerCase().includes('accuracy')) {
    return 'পরবর্তী লেভেলে যাওয়ার জন্য প্রয়োজনীয় নির্ভুলতা বজায় রাখুন।';
  }
  return enText; // Fallback
}

export const StageInstructionsModal: React.FC<StageInstructionsModalProps> = ({
  stage,
  onStart
}) => {
  const [lang, setLang] = useState<'en' | 'bn' | 'both'>('bn');

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '560px' }}>
        <div className="modal-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--icst-blue-dark)', fontWeight: 700, letterSpacing: '0.5px' }}>
              Level {stage.levelNumber} • Stage {stage.stageNumber} Instructions
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--icst-charcoal)' }}>
              {stage.title}
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
            <span style={{
              background: stage.requiredAccuracy === 100 ? '#fee2e2' : 'var(--icst-blue-soft)',
              color: stage.requiredAccuracy === 100 ? '#991b1b' : 'var(--icst-blue-dark)',
              border: `1px solid ${stage.requiredAccuracy === 100 ? '#fca5a5' : 'var(--icst-blue-border)'}`,
              padding: '3px 10px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 700
            }}>
              Target: {stage.requiredAccuracy}%
            </span>

            {/* Language Switcher */}
            <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '6px', padding: '2px', border: '1px solid #cbd5e1' }}>
              <button
                type="button"
                onClick={() => setLang('bn')}
                style={{
                  border: 'none',
                  background: lang === 'bn' ? '#2563eb' : 'transparent',
                  color: lang === 'bn' ? '#ffffff' : '#64748b',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                বাংলা
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                style={{
                  border: 'none',
                  background: lang === 'en' ? '#2563eb' : 'transparent',
                  color: lang === 'en' ? '#ffffff' : '#64748b',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLang('both')}
                style={{
                  border: 'none',
                  background: lang === 'both' ? '#2563eb' : 'transparent',
                  color: lang === 'both' ? '#ffffff' : '#64748b',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Both
              </button>
            </div>
          </div>
        </div>

        <div className="modal-body" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          <p style={{ marginBottom: '14px', lineHeight: '1.6' }}>
            {stage.description}
          </p>

          <div style={{
            background: '#f8fafc',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
              <CheckCircle2 size={16} color="var(--icst-blue)" />
              <span>Operational Requirements / কাজের নির্দেশনাবলী</span>
            </div>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {stage.instructions.map((inst, idx) => {
                const bnInst = getBengaliInstruction(inst);
                return (
                  <li key={idx} style={{ lineHeight: '1.45' }}>
                    {(lang === 'en' || lang === 'both') && (
                      <div style={{ color: 'var(--text-primary)' }}>{inst}</div>
                    )}
                    {(lang === 'bn' || lang === 'both') && (
                      <div style={{ 
                        color: lang === 'both' ? '#047857' : 'var(--text-primary)', 
                        fontSize: '12.5px',
                        marginTop: lang === 'both' ? '2px' : '0'
                      }}>
                        {bnInst}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '8px 10px', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Difficulty / স্তর</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{stage.difficulty}</div>
            </div>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '8px 10px', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Min Accuracy / সর্বনিম্ন নির্ভুলতা</div>
              <div style={{ fontWeight: 700, color: stage.requiredAccuracy === 100 ? '#b91c1c' : 'var(--icst-blue-dark)' }}>
                {stage.requiredAccuracy}%
              </div>
            </div>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '8px 10px', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Clearance EXP / অভিজ্ঞতা পয়েন্ট</div>
              <div style={{ fontWeight: 700, color: '#b45309' }}>+{stage.baseExp} EXP</div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-primary"
            onClick={onStart}
            autoFocus
          >
            <span>BEGIN ENTRY / শুরু করুন</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
