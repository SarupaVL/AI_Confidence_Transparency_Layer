import React from 'react';

export default function Compare() {
  const comparisons = [
    {
      name: "SelfCheckGPT",
      year: "2023",
      focus: "Generative Consistency",
      pros: "No external database needed; purely sampling-based.",
      cons: "Lacks semantic calibration; single-axis evaluation.",
      ourEdge: "We use a multi-axis system that combines sampling consistency with adversarial perturbation.",
    },
    {
      name: "Chain-of-Verification (CoVe)",
      year: "2023",
      focus: "Factual Self-Correction",
      pros: "Drafts verification questions sequentially to correct outputs.",
      cons: "High latency; doesn't project risk back mapping to the user.",
      ourEdge: "We map verifications safely into inline UI highlights (actionable transparency).",
    },
    {
      name: "Verify-and-Edit",
      year: "2022",
      focus: "External Retrieval (RAG)",
      pros: "Relies on external knowledge bases (like Wikipedia) for high fidelity.",
      cons: "Not model-agnostic; fails when retrieving off-topic documents.",
      ourEdge: "Our Confidence Layer is 100% agnostic and zero-shot; no reliance on brittle search indexing.",
    },
    {
      name: "FActScore",
      year: "2023",
      focus: "Atomic Fact Extraction",
      pros: "Excellent at splitting paragraphs into verifiable units.",
      cons: "Produces a single scalar number; lacks localized visual user feedback.",
      ourEdge: "We extract atomic claims but structurally reconstruct the original response with claim-level diagnostics.",
    },
    {
      name: "R-Tuning",
      year: "2022",
      focus: "Rejection Tuning",
      pros: "Trains the model to refuse answering unknown questions.",
      cons: "Expensive fine-tuning required; degrades conversational capability.",
      ourEdge: "A zero-weight proxy. No model re-training or weight freezing required.",
    }
  ];

  return (
    <div className="info-page fade-in">
      <div className="info-page-header">
        <h2>Comparative Superiority</h2>
        <p>Why a Multi-Axis Confidence approach outperforms Single-Axis heuristics.</p>
      </div>

      <div className="info-content">
        <section className="info-section">
          <h3>The state of Hallucination Mitigation (2020-2025)</h3>
          <p>
            For the past half-decade, researchers have attempted to solve LLM hallucination through piecemeal interventions: some focused on consistency (SelfCheckGPT), others on extraction (FActScore), and others on pure retrieval. Our goal is to unify these fragmented methodologies into a <strong>single user-facing diagnostic layer</strong>.
          </p>
        </section>

        <section className="info-section">
          <div className="compare-matrix">
            {comparisons.map((comp, idx) => (
              <div key={idx} className="compare-card">
                <div className="compare-card-top">
                  <span className="comp-name">{comp.name}</span>
                  <span className="comp-year">{comp.year}</span>
                </div>
                <div className="comp-focus">Focus: <em>{comp.focus}</em></div>
                <div className="comp-insight">
                  <strong>Pros:</strong> {comp.pros}
                </div>
                <div className="comp-insight">
                  <strong style={{color: '#ef4444'}}>Cons:</strong> {comp.cons}
                </div>
                <div className="comp-victory">
                  <strong>Our Approach:</strong> {comp.ourEdge}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="info-section bottom-statement">
          <h3>Actionable Transparency vs. Opaque Metrics</h3>
          <p>
            A model throwing a "Confidence: 45%" alert is useless unless you know exactly <em>which</em> claims dragged the score down. By combining statistical multi-sampling with granular semantic inline highlights, this project bridges the gap between academic research frameworks and consumer-grade UI expectations.
          </p>
        </section>
      </div>
    </div>
  );
}
