import React, { useMemo, useState } from 'react';
import './SoapNoteTranscriber.css';

const SECTION_META = [
  {
    key: 'subjective',
    title: 'Subjective',
    helper: 'Patient-reported concerns, history, and symptoms discussed during the meeting.',
  },
  {
    key: 'objective',
    title: 'Objective',
    helper: 'Clinical observations, diagnostics, and measurable findings shared by the team.',
  },
  {
    key: 'assessment',
    title: 'Assessment',
    helper: 'Diagnostic impressions, problem lists, and professional interpretations.',
  },
  {
    key: 'plan',
    title: 'Plan',
    helper: 'Proposed treatments, follow-ups, tasks, and responsibilities agreed upon.',
  },
];

const KEYWORD_LIBRARY = {
  subjective: [
    'reports',
    'states',
    'notes',
    'complains',
    'pain',
    'sensitivity',
    'history',
    'concern',
    'fear',
    'anxious',
    'feels',
    'symptom',
    'chief complaint',
  ],
  objective: [
    'exam',
    'observed',
    'findings',
    'pocket',
    'mm',
    'probe',
    'radiograph',
    'x-ray',
    'imaging',
    'visual',
    'charting',
    'vital',
    'gum',
    'tissue',
    'lesion',
    'mobility',
    'measure',
    'calculus',
  ],
  assessment: [
    'diagnosis',
    'assessment',
    'decay',
    'caries',
    'periodontal',
    'gingivitis',
    'evaluation',
    'likely',
    'suspect',
    'indicates',
    'differential',
    'risk',
    'classification',
  ],
  plan: [
    'plan',
    'recommend',
    'schedule',
    'follow-up',
    'follow up',
    'next visit',
    'will',
    'proceed',
    'start',
    'implement',
    'prescribe',
    'deliver',
    'coordinate',
    'refer',
    'order',
  ],
};

const RISK_KEYWORDS = ['urgent', 'infection', 'abscess', 'swelling', 'uncontrolled', 'bleeding', 'emergency'];
const ACTION_KEYWORDS = ['schedule', 'call', 'order', 'submit', 'prepare', 'follow', 'coordinate', 'arrange', 'review'];

const defaultMetadata = {
  patientName: '',
  meetingDate: '',
  provider: '',
  hygienist: '',
  meetingFocus: '',
};

const splitSentences = (text) =>
  text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 3);

const assignSection = (sentence) => {
  const lower = sentence.toLowerCase();

  const matches = Object.entries(KEYWORD_LIBRARY).map(([section, keywords]) => ({
    section,
    score: keywords.reduce((acc, keyword) => (lower.includes(keyword) ? acc + 1 : acc), 0),
  }));

  const bestMatch = matches.reduce(
    (prev, current) => (current.score > prev.score ? current : prev),
    { section: 'objective', score: 0 }
  );

  if (bestMatch.score > 0) {
    return bestMatch.section;
  }

  if (lower.includes('plan to') || lower.includes('will ') || lower.includes('need to')) {
    return 'plan';
  }

  if (lower.includes('reports') || lower.includes('pain') || lower.includes('complain')) {
    return 'subjective';
  }

  return 'objective';
};

const detectActionOwner = (sentence) => {
  const ownerMatch = sentence.match(/(?:Dr\.?\s+[A-Z][a-z]+|[A-Z][a-z]+(?=\s+(?:will|to)))/);
  return ownerMatch ? ownerMatch[0] : 'Team';
};

const analyseTranscript = (text) => {
  const sentences = splitSentences(text);
  const sections = {
    subjective: [],
    objective: [],
    assessment: [],
    plan: [],
  };
  const actionItems = [];
  const riskFlags = [];

  sentences.forEach((sentence) => {
    const trimmed = sentence.trim();
    if (!trimmed) {
      return;
    }

    const section = assignSection(trimmed);
    sections[section].push(trimmed);

    const lower = trimmed.toLowerCase();

    if (RISK_KEYWORDS.some((keyword) => lower.includes(keyword))) {
      riskFlags.push(trimmed);
    }

    if (ACTION_KEYWORDS.some((keyword) => lower.includes(keyword)) || section === 'plan') {
      actionItems.push({
        owner: detectActionOwner(trimmed),
        detail: trimmed,
        priority: lower.includes('urgent') || lower.includes('asap') ? 'High' : 'Routine',
      });
    }
  });

  const words = text
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);

  return {
    sections,
    actionItems,
    riskFlags,
    metrics: {
      sentenceCount: sentences.length,
      wordCount: words.length,
      estimatedDuration: words.length ? Math.round((words.length / 150) * 60) : 0,
    },
  };
};

const buildNoteText = (metadata, sectionText) => {
  const header = [
    metadata.patientName ? `Patient: ${metadata.patientName}` : null,
    metadata.meetingDate ? `Date: ${metadata.meetingDate}` : null,
    metadata.provider ? `Provider: ${metadata.provider}` : null,
    metadata.hygienist ? `Hygienist/Assistant: ${metadata.hygienist}` : null,
    metadata.meetingFocus ? `Focus: ${metadata.meetingFocus}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  const body = SECTION_META.map(({ key, title }) => {
    const content = sectionText[key]?.trim() || '•';
    return `${title}:\n${content}`;
  }).join('\n\n');

  return [header, body].filter(Boolean).join('\n\n');
};

const SoapNoteTranscriber = () => {
  const [metadata, setMetadata] = useState(defaultMetadata);
  const [transcript, setTranscript] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [sectionDrafts, setSectionDrafts] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleMetadataChange = (field, value) => {
    setMetadata((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGenerate = () => {
    if (!transcript.trim()) {
      setAnalysis(null);
      setSectionDrafts(null);
      return;
    }

    const result = analyseTranscript(transcript);
    setAnalysis(result);
    setSectionDrafts(
      SECTION_META.reduce(
        (acc, { key }) => ({
          ...acc,
          [key]: result.sections[key].length ? `• ${result.sections[key].join('\n• ')}` : '',
        }),
        {}
      )
    );
    setCopied(false);
  };

  const handleClear = () => {
    setTranscript('');
    setAnalysis(null);
    setSectionDrafts(null);
    setCopied(false);
  };

  const quickInsights = useMemo(() => {
    if (!analysis) {
      return [];
    }

    const insights = [];

    if (analysis.sections.subjective.length) {
      insights.push(`Primary concern: ${analysis.sections.subjective[0]}`);
    }

    if (analysis.sections.assessment.length) {
      insights.push(`Working diagnosis: ${analysis.sections.assessment[analysis.sections.assessment.length - 1]}`);
    }

    if (analysis.actionItems.length) {
      insights.push(`Action items captured: ${analysis.actionItems.length}`);
    }

    if (analysis.riskFlags.length) {
      insights.push('Attention: Potential risk factors flagged in conversation.');
    }

    return insights;
  }, [analysis]);

  const compiledNote = useMemo(() => {
    if (!sectionDrafts) {
      return '';
    }

    return buildNoteText(metadata, sectionDrafts);
  }, [metadata, sectionDrafts]);

  const handleCopy = async () => {
    if (!compiledNote) {
      return;
    }

    try {
      await navigator.clipboard.writeText(compiledNote);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (error) {
      console.error('Clipboard copy failed', error);
      setCopied(false);
    }
  };

  const handleSectionChange = (key, value) => {
    setSectionDrafts((prev) => ({
      ...prev,
      [key]: value,
    }));
    setCopied(false);
  };

  return (
    <div className="soap-transcriber">
      <div className="soap-transcriber__intro">
        <h2>Dentist SOAP Note Transcriber</h2>
        <p>
          Transform internal meeting transcripts into structured SOAP notes for dental teams. Paste a
          transcript, capture key metadata, and generate an editable note ready for your charting
          system.
        </p>
      </div>

      <section className="soap-transcriber__metadata">
        <h3>Encounter Metadata</h3>
        <div className="soap-transcriber__grid">
          <label>
            <span>Patient name</span>
            <input
              type="text"
              value={metadata.patientName}
              onChange={(event) => handleMetadataChange('patientName', event.target.value)}
              placeholder="e.g., Jordan Matthews"
            />
          </label>
          <label>
            <span>Meeting date</span>
            <input
              type="date"
              value={metadata.meetingDate}
              onChange={(event) => handleMetadataChange('meetingDate', event.target.value)}
            />
          </label>
          <label>
            <span>Lead provider</span>
            <input
              type="text"
              value={metadata.provider}
              onChange={(event) => handleMetadataChange('provider', event.target.value)}
              placeholder="e.g., Dr. Hwang"
            />
          </label>
          <label>
            <span>Hygienist / Assistant</span>
            <input
              type="text"
              value={metadata.hygienist}
              onChange={(event) => handleMetadataChange('hygienist', event.target.value)}
              placeholder="e.g., Morgan (RDH)"
            />
          </label>
          <label className="soap-transcriber__full-width">
            <span>Meeting focus</span>
            <input
              type="text"
              value={metadata.meetingFocus}
              onChange={(event) => handleMetadataChange('meetingFocus', event.target.value)}
              placeholder="e.g., Pre-op coordination for implant on #14"
            />
          </label>
        </div>
      </section>

      <section className="soap-transcriber__transcript">
        <div className="soap-transcriber__transcript-header">
          <h3>Transcript</h3>
          <div className="soap-transcriber__actions">
            <button type="button" onClick={handleGenerate} className="primary">
              Generate SOAP note
            </button>
            <button type="button" onClick={handleClear} className="ghost">
              Clear
            </button>
          </div>
        </div>
        <textarea
          value={transcript}
          onChange={(event) => setTranscript(event.target.value)}
          placeholder="Paste or type the team meeting transcript here..."
          rows={10}
        />
        <p className="soap-transcriber__hint">
          Tip: Include speaker names (e.g., “Dr. Singh: We should schedule a follow-up...”) to help the
          assistant assign action items.
        </p>
      </section>

      {analysis && (
        <section className="soap-transcriber__summary">
          <div className="soap-transcriber__insights">
            <h3>Quick insights</h3>
            {quickInsights.length ? (
              <ul>
                {quickInsights.map((insight, index) => (
                  <li key={index}>{insight}</li>
                ))}
              </ul>
            ) : (
              <p>No specific highlights detected. Review the sections below.</p>
            )}
          </div>

          <div className="soap-transcriber__metrics">
            <h4>Transcript metrics</h4>
            <ul>
              <li>
                Sentences processed: <strong>{analysis.metrics.sentenceCount}</strong>
              </li>
              <li>
                Word count: <strong>{analysis.metrics.wordCount}</strong>
              </li>
              <li>
                Estimated duration (150 wpm): <strong>{analysis.metrics.estimatedDuration} seconds</strong>
              </li>
            </ul>
          </div>

          {analysis.riskFlags.length > 0 && (
            <div className="soap-transcriber__risks">
              <h4>Risk alerts</h4>
              <ul>
                {analysis.riskFlags.map((flag, index) => (
                  <li key={index}>{flag}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {analysis && (
        <section className="soap-transcriber__note">
          <div className="soap-transcriber__note-header">
            <h3>Editable SOAP note</h3>
            <button type="button" onClick={handleCopy} disabled={!compiledNote} className="primary">
              {copied ? 'Copied to clipboard!' : 'Copy full note'}
            </button>
          </div>
          <div className="soap-transcriber__sections">
            {SECTION_META.map(({ key, title, helper }) => (
              <div key={key} className="soap-transcriber__section-card">
                <header>
                  <h4>{title}</h4>
                  <p>{helper}</p>
                </header>
                <textarea
                  value={sectionDrafts?.[key] || ''}
                  onChange={(event) => handleSectionChange(key, event.target.value)}
                  rows={6}
                  placeholder={`Add ${title.toLowerCase()} details here...`}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {analysis && analysis.actionItems.length > 0 && (
        <section className="soap-transcriber__actions-table">
          <h3>Action items for follow-up</h3>
          <div className="soap-transcriber__table">
            <div className="soap-transcriber__table-row soap-transcriber__table-row--header">
              <div>Owner</div>
              <div>Detail</div>
              <div>Priority</div>
            </div>
            {analysis.actionItems.map((item, index) => (
              <div key={`${item.detail}-${index}`} className="soap-transcriber__table-row">
                <div>{item.owner}</div>
                <div>{item.detail}</div>
                <div>
                  <span className={`priority priority--${item.priority.toLowerCase()}`}>
                    {item.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {compiledNote && (
        <section className="soap-transcriber__preview">
          <h3>Note preview</h3>
          <pre>{compiledNote}</pre>
        </section>
      )}
    </div>
  );
};

export default SoapNoteTranscriber;
