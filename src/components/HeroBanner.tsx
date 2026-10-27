'use client';
import React from 'react';
import { DomainDefinition, CuratedItem } from '@/types';

interface HeroBannerProps {
  currentDomain: DomainDefinition;
  items: CuratedItem[];
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ currentDomain, items }) => {
  const avgScore = items.length > 0
    ? Math.round(items.reduce((acc, it) => acc + it.evaluation.score, 0) / items.length)
    : 0;

  const dealsCount = items.filter(it => it.discountPct && it.discountPct > 0).length;

  return (
    <section className="hero-section" id="hero-banner-section">
      <div className="hero-banner">
        <div className="hero-text">
          <h2>{currentDomain.icon} {currentDomain.name}</h2>
          <p>{currentDomain.description}</p>
        </div>

        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-value">{items.length}</div>
            <div className="stat-label">Achados Ativos</div>
          </div>

          <div className="stat-item">
            <div className="stat-value" style={{ color: 'var(--accent-success)' }}>
              {avgScore}%
            </div>
            <div className="stat-label">Match Médio</div>
          </div>

          <div className="stat-item">
            <div className="stat-value" style={{ color: 'var(--accent-danger)' }}>
              {dealsCount}
            </div>
            <div className="stat-label">Em Promoção</div>
          </div>
        </div>
      </div>
    </section>
  );
};
