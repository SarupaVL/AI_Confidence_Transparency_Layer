import React from 'react';

export default function About() {
  return (
    <div className="info-page fade-in">
      <div className="info-page-header">
        <h2>About the Confidence Layer</h2>
        <p>Demystifying how we evaluate and score LLM reliability, claim by claim.</p>
      </div>

      <div className="info-content">
        <section className="info-section">
          <h3>The Problem with LLMs</h3>
          <p>
            Standard conversational AI interfaces give you a single, highly plausible answer. The model is optimized for fluency, not factual density. This causes high-confidence hallucinations to slip past human review.
          </p>
        </section>

        <section className="info-section">
          <h3>How the Pipeline Works</h3>
          <p>When you submit a prompt, we freeze the interface and run a 5-step distributed verification pipeline in the background before showing you the result:</p>
          
          <div className="pipeline-grid">
            <div className="pipeline-card">
              <span className="card-no">1</span>
              <h4>Multi-Sampling</h4>
              <p>We sample the model multiple times at low temperature to isolate deterministic knowledge versus stochastic guessing.</p>
            </div>
            <div className="pipeline-card">
              <span className="card-no">2</span>
              <h4>Perturbation</h4>
              <p>We subtly rewrite your prompt and re-submit it to measure sensitivity. If the facts drop out, the model doesn't actually "know" it.</p>
            </div>
            <div className="pipeline-card">
              <span className="card-no">3</span>
              <h4>Claim Extraction</h4>
              <p>The responses are shredded into atomic, verifiable factual claims, isolating them from structural padding and pleasantries.</p>
            </div>
            <div className="pipeline-card">
              <span className="card-no">4</span>
              <h4>Verification</h4>
              <p>Each atomic claim is back-propagated and evaluated strictly for contradiction or unsupported uncertainty.</p>
            </div>
            <div className="pipeline-card">
              <span className="card-no">5</span>
              <h4>Calibration</h4>
              <p>Finally, we analyze the semantic vocabulary for hesitation metrics (e.g. "might", "could", "perhaps") and aggregate a score.</p>
            </div>
          </div>
        </section>

        <section className="info-section">
          <h3>Interpreting the Highlights</h3>
          <p>Instead of just giving you a final heuristic score, we project the diagnostics directly onto the answer markdown so you know exactly which sentences to trust.</p>
          
          <div className="highlight-demobox">
            <div className="demo-text">
              <span>The Eiffel Tower was built in 1889 for the World's Fair. </span>
              <span className="highlight-uncertain" title="Could not be independently verified">It was originally intended to be dismantled after 20 years. </span>
              <span className="highlight-contradicted" title="Structurally contradicts consensus">However, it was actually designed and built by Thomas Edison on a trip to France.</span>
            </div>
            <ul className="demo-legend">
              <li><strong>Plain Text:</strong> Fully supported by low-temperature verification.</li>
              <li><strong style={{color: '#eab308'}}>Yellow Highlight:</strong> Unverified. The model failed to stand perfectly behind this claim under perturbation testing.</li>
              <li><strong style={{color: '#ef4444'}}>Red Highlight:</strong> Contradicted. High probability of hallucination or factual inconsistency.</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
