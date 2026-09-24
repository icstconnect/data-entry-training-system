import React, { useState } from 'react';
import { SourceRecord } from '../../types';
import { FileText, ChevronDown, ChevronUp, ShieldCheck, Hash, User, Building, Award } from 'lucide-react';

interface SourceDocumentViewerProps {
  sourceRecord: SourceRecord;
}

export const SourceDocumentViewer: React.FC<SourceDocumentViewerProps> = ({ sourceRecord }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="source-card">
      <div className="source-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={16} />
          <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.3px' }}>
            SOURCE RECORD CARD
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="source-badge">{sourceRecord.uid}</span>
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{ color: '#94a3b8', display: 'flex', alignItems: 'center' }}
            title={isCollapsed ? 'Expand Reference Document' : 'Collapse Reference Document'}
          >
            {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="source-body">
          <div className="source-watermark">
            <ShieldCheck size={14} color="#0f766e" />
            <span>REFERENCE RECORD • TYPE VALUE INTO CORRESPONDING DESTINATION FIELD</span>
          </div>

          {/* Section 1: Candidate Identity */}
          <div className="source-section">
            <div className="source-section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={13} />
              <span>Personal Identity</span>
            </div>
            <div className="source-grid">
              <div className="source-item full-width">
                <span className="source-key">Student Legal Name</span>
                <span className="source-val">{sourceRecord.studentName}</span>
              </div>
              <div className="source-item full-width">
                <span className="source-key">Father / Guardian Name</span>
                <span className="source-val">{sourceRecord.guardianName}</span>
              </div>
              <div className="source-item">
                <span className="source-key">Date of Birth</span>
                <span className="source-val">{sourceRecord.dob}</span>
              </div>
              <div className="source-item">
                <span className="source-key">Gender</span>
                <span className="source-val">{sourceRecord.gender}</span>
              </div>
              <div className="source-item">
                <span className="source-key">Social Category</span>
                <span className="source-val">{sourceRecord.category}</span>
              </div>
              <div className="source-item">
                <span className="source-key">Blood Group</span>
                <span className="source-val">{sourceRecord.bloodGroup}</span>
              </div>
              {sourceRecord.aadhaarNumber && (
                <div className="source-item full-width">
                  <span className="source-key">Aadhaar Identification</span>
                  <span className="source-val">{sourceRecord.aadhaarNumber}</span>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Contact & Domicile */}
          <div className="source-section">
            <div className="source-section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Hash size={13} />
              <span>Contact & Domicile</span>
            </div>
            <div className="source-grid">
              <div className="source-item">
                <span className="source-key">Phone Number</span>
                <span className="source-val">{sourceRecord.phone}</span>
              </div>
              <div className="source-item">
                <span className="source-key">Email ID</span>
                <span className="source-val" style={{ fontSize: '11px' }}>{sourceRecord.email}</span>
              </div>
              <div className="source-item full-width">
                <span className="source-key">Premise / Village</span>
                <span className="source-val">{sourceRecord.address.premise}</span>
              </div>
              <div className="source-item full-width">
                <span className="source-key">Street / Road</span>
                <span className="source-val">{sourceRecord.address.street}</span>
              </div>
              <div className="source-item">
                <span className="source-key">District</span>
                <span className="source-val">{sourceRecord.address.district}</span>
              </div>
              <div className="source-item">
                <span className="source-key">PIN Code</span>
                <span className="source-val">{sourceRecord.address.pinCode}</span>
              </div>
              <div className="source-item">
                <span className="source-key">State</span>
                <span className="source-val">{sourceRecord.address.state}</span>
              </div>
              <div className="source-item">
                <span className="source-key">Nationality</span>
                <span className="source-val">{sourceRecord.nationality}</span>
              </div>
            </div>
          </div>

          {/* Section 3: School & Academic */}
          <div className="source-section">
            <div className="source-section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Building size={13} />
              <span>Institution & Registration</span>
            </div>
            <div className="source-grid">
              <div className="source-item full-width">
                <span className="source-key">School Name</span>
                <span className="source-val">{sourceRecord.schoolInfo.schoolName}</span>
              </div>
              <div className="source-item">
                <span className="source-key">School Index Code</span>
                <span className="source-val">{sourceRecord.schoolInfo.schoolCode}</span>
              </div>
              <div className="source-item">
                <span className="source-key">Board</span>
                <span className="source-val">{sourceRecord.schoolInfo.board}</span>
              </div>
              <div className="source-item">
                <span className="source-key">Medium</span>
                <span className="source-val">{sourceRecord.schoolInfo.medium}</span>
              </div>
              <div className="source-item">
                <span className="source-key">Admission No</span>
                <span className="source-val">{sourceRecord.schoolInfo.admissionNumber}</span>
              </div>
              <div className="source-item">
                <span className="source-key">Admission Date</span>
                <span className="source-val">{sourceRecord.schoolInfo.admissionDate}</span>
              </div>
              {sourceRecord.schoolInfo.stream && (
                <div className="source-item">
                  <span className="source-key">Stream</span>
                  <span className="source-val">{sourceRecord.schoolInfo.stream}</span>
                </div>
              )}
              {sourceRecord.academic.registrationNumber && (
                <div className="source-item full-width">
                  <span className="source-key">Board Registration No</span>
                  <span className="source-val">{sourceRecord.academic.registrationNumber}</span>
                </div>
              )}
              {sourceRecord.academic.rollNumber && (
                <div className="source-item">
                  <span className="source-key">Admit Roll Number</span>
                  <span className="source-val">{sourceRecord.academic.rollNumber}</span>
                </div>
              )}
              {sourceRecord.academic.examCenterCode && (
                <div className="source-item">
                  <span className="source-key">Exam Center Code</span>
                  <span className="source-val">{sourceRecord.academic.examCenterCode}</span>
                </div>
              )}
              {sourceRecord.academic.previousPercentage !== undefined && (
                <div className="source-item">
                  <span className="source-key">Past Qualifying %</span>
                  <span className="source-val">{sourceRecord.academic.previousPercentage}%</span>
                </div>
              )}
              {sourceRecord.academic.conduct && (
                <div className="source-item">
                  <span className="source-key">Conduct</span>
                  <span className="source-val">{sourceRecord.academic.conduct}</span>
                </div>
              )}
              {sourceRecord.academic.activities && sourceRecord.academic.activities.length > 0 && (
                <div className="source-item full-width">
                  <span className="source-key">Co-curricular Activities</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                    {sourceRecord.academic.activities.map((act, i) => (
                      <span key={i} style={{ background: '#e2e8f0', color: '#1e293b', fontSize: '11px', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>
                        {act}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Table Rows (if present) */}
          {sourceRecord.tableRows && sourceRecord.tableRows.length > 0 && (
            <div className="source-section">
              <div className="source-section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Award size={13} />
                <span>Internal Term Scores</span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9', color: '#475569' }}>
                      <th style={{ padding: '4px 6px', textAlign: 'left' }}>Subject</th>
                      <th style={{ padding: '4px 6px', textAlign: 'center' }}>Full</th>
                      <th style={{ padding: '4px 6px', textAlign: 'center' }}>Scored</th>
                      <th style={{ padding: '4px 6px', textAlign: 'center' }}>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sourceRecord.tableRows.map((r, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '4px 6px', fontWeight: 600 }}>{r.subject}</td>
                        <td style={{ padding: '4px 6px', textAlign: 'center' }}>{r.maxMarks}</td>
                        <td style={{ padding: '4px 6px', textAlign: 'center', fontWeight: 700, color: 'var(--icst-blue-dark)' }}>{r.marksObtained}</td>
                        <td style={{ padding: '4px 6px', textAlign: 'center' }}>{r.grade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section 5: Marksheet (if present) */}
          {sourceRecord.marksheet && (
            <div className="source-section">
              <div className="source-section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Award size={13} />
                <span>Examination Marksheet File</span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9', color: '#475569' }}>
                      <th style={{ padding: '4px 6px', textAlign: 'left' }}>Subject</th>
                      <th style={{ padding: '4px 6px', textAlign: 'center' }}>Theory</th>
                      <th style={{ padding: '4px 6px', textAlign: 'center' }}>Oral</th>
                      <th style={{ padding: '4px 6px', textAlign: 'center' }}>Total</th>
                      <th style={{ padding: '4px 6px', textAlign: 'center' }}>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sourceRecord.marksheet.subjects.map(s => (
                      <tr key={s.code} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '4px 6px', fontWeight: 500 }}>{s.name}</td>
                        <td style={{ padding: '4px 6px', textAlign: 'center' }}>{s.theory ?? '-'}</td>
                        <td style={{ padding: '4px 6px', textAlign: 'center' }}>{s.oral ?? '-'}</td>
                        <td style={{ padding: '4px 6px', textAlign: 'center', fontWeight: 700, color: 'var(--icst-blue-dark)' }}>{s.total}</td>
                        <td style={{ padding: '4px 6px', textAlign: 'center' }}>{s.grade || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700 }}>
                <span>Grand Total: {sourceRecord.marksheet.grandTotal}</span>
                <span style={{ color: 'var(--success-green)' }}>{sourceRecord.marksheet.division || 'PASS'}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
