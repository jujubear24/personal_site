/**
 * ContentOverlay - Sentient UI Content Views
 * 
 * Renders Resume, Blog, and Contact sections as overlays
 * on top of the 3D agent background.
 */

'use client';

import React, { useState } from 'react';
import type { ViewMode, ContentOverlayProps } from '@/types/sentient';

/**
 * Reusable Schematic Card Component
 */
interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  date?: string;
  badge?: string;
  noPadding?: boolean;
}

const SchematicCard: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  date,
  badge,
  noPadding = false,
}) => (
  <div
    className={`relative bg-white/95 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-100 dark:border-gray-800 shadow-[0_4px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)] rounded-sm overflow-hidden group transition-all duration-500 animate-fadeIn hover:shadow-[0_8px_40px_rgba(220,38,38,0.05)] dark:hover:shadow-[0_8px_40px_rgba(220,38,38,0.1)] hover:border-amber-500/20 dark:hover:border-amber-500/20 ${className}`}
  >
    {/* Decorative Top Bar */}
    <div className="h-0.5 w-full bg-gradient-to-r from-amber-400 via-red-500 to-amber-400 opacity-60" />

    {/* Header Section */}
    {(title || subtitle) && (
      <div className="px-8 pt-8 pb-6 flex justify-between items-start border-b border-gray-50 dark:border-gray-800 border-dashed relative">
        <div>
          {badge && (
            <span className="inline-block px-2 py-0.5 mb-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-[9px] font-mono font-bold tracking-widest uppercase rounded-sm border border-red-100/50 dark:border-red-900/30">
              {badge}
            </span>
          )}
          {title && (
            <h3 className="font-serif text-3xl text-gray-900 dark:text-gray-100 italic tracking-tight">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="font-mono text-[10px] text-amber-600 dark:text-amber-500 uppercase tracking-[0.2em] mt-2 font-bold">
              {subtitle}
            </p>
          )}
        </div>
        {date && (
          <div className="hidden md:block text-right">
            <div className="font-mono text-[9px] text-gray-400 tracking-wider">
              TIMESTAMP
            </div>
            <div className="font-mono text-xs text-red-900 dark:text-red-300 font-bold">
              {date}
            </div>
          </div>
        )}
        {/* Corner Accent */}
        <div className="absolute top-0 right-0 w-8 h-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-12 h-0.5 bg-red-500 rotate-45 translate-x-4 translate-y-2 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    )}

    {/* Content Body */}
    <div className={noPadding ? '' : 'p-8'}>{children}</div>

    {/* Technical Footer Decorators */}
    <div className="absolute bottom-3 left-4 flex gap-1.5">
      <div className="w-1 h-1 rounded-full bg-amber-400" />
      <div className="w-1 h-1 rounded-full bg-red-500" />
      <div className="w-1 h-1 rounded-full bg-gray-200 dark:bg-gray-700" />
    </div>
    <div className="absolute bottom-3 right-4 text-[8px] font-mono text-gray-300 dark:text-gray-700 tracking-widest pointer-events-none select-none">
      REF.{Math.floor(Math.random() * 9999).toString(16).toUpperCase()}
    </div>
  </div>
);

/**
 * Skill Bar Component
 */
const SkillBar: React.FC<{ name: string; level: number }> = ({ name, level }) => (
  <div className="mb-4 group">
    <div className="flex justify-between items-end mb-1.5">
      <span className="font-mono text-[11px] text-gray-600 dark:text-gray-400 font-bold uppercase tracking-wider group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
        {name}
      </span>
      <span className="font-mono text-[10px] text-amber-600 dark:text-amber-500 font-bold">
        {level}% LOAD
      </span>
    </div>
    <div className="h-1 w-full bg-gray-100 dark:bg-gray-800 overflow-hidden relative rounded-full">
      <div
        className="h-full bg-gray-800 dark:bg-gray-200 transition-all duration-1000 group-hover:bg-gradient-to-r group-hover:from-amber-500 group-hover:to-red-500 ease-out"
        style={{ width: `${level}%` }}
      />
      <div className="absolute inset-0 bg-white/50 w-full -translate-x-full group-hover:animate-shimmer" />
    </div>
  </div>
);

/**
 * Resume Content Section
 */
const ResumeContent: React.FC = () => (
  <div className="w-full max-w-5xl mx-auto space-y-6 pb-32">
    {/* Header Identity Card */}
    <SchematicCard className="p-0 overflow-visible border-none bg-transparent shadow-none">
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-100 dark:border-gray-800 shadow-sm rounded-sm p-10 md:p-14 relative overflow-hidden animate-fadeIn">
        {/* Background typographical texture */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 text-[200px] font-serif italic text-gray-50 dark:text-gray-800 opacity-50 select-none pointer-events-none transition-colors">
          J/A
        </div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-0.5 w-12 bg-red-500" />
                <span className="font-mono text-[10px] font-bold text-red-600 dark:text-red-400 tracking-[0.2em] uppercase">
                  Senior Systems Engineer
                </span>
              </div>
              <h1 className="text-6xl md:text-8xl font-serif italic text-gray-900 dark:text-white leading-[0.85] tracking-tight">
                Jules <span className="text-amber-500 font-light">/</span> Arch
              </h1>
            </div>

            <div className="flex flex-col items-start md:items-end">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 border border-gray-800 dark:border-gray-200 rounded-full shadow-lg mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 dark:bg-green-600 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                <span className="font-mono text-[9px] font-bold tracking-widest uppercase">
                  Open for Work
                </span>
              </div>
              <div className="font-mono text-xs text-gray-500 dark:text-gray-400 text-right">
                ID: <span className="text-gray-900 dark:text-white font-bold">ARCH_V3.2</span>
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-gray-200 via-gray-300 to-transparent dark:from-gray-800 dark:via-gray-700 mb-8" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <p className="font-serif text-xl text-gray-600 dark:text-gray-300 leading-relaxed italic">
              Building digital systems at the intersection of engineering
              precision and creative vision. Focused on AI, web infrastructure,
              and developer experience.
            </p>
            <div className="flex flex-wrap gap-2 md:justify-end">
              {['TypeScript', 'Python', 'React', 'Node.js', 'AI/ML'].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-mono text-xs rounded-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SchematicCard>

    {/* Skills Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SchematicCard title="Technical Proficiency" subtitle="Core Stack">
        <SkillBar name="TypeScript / JavaScript" level={95} />
        <SkillBar name="Python" level={90} />
        <SkillBar name="React / Next.js" level={92} />
        <SkillBar name="Node.js" level={88} />
        <SkillBar name="AI / Machine Learning" level={85} />
      </SchematicCard>

      <SchematicCard title="Systems & Tools" subtitle="Infrastructure">
        <SkillBar name="Docker / Kubernetes" level={85} />
        <SkillBar name="PostgreSQL / Redis" level={88} />
        <SkillBar name="AWS / GCP" level={82} />
        <SkillBar name="Git / CI/CD" level={95} />
        <SkillBar name="Linux / Shell" level={90} />
      </SchematicCard>
    </div>

    {/* Experience Section */}
    <SchematicCard
      title="Professional Timeline"
      subtitle="Experience Log"
      badge="Active"
    >
      <div className="space-y-8">
        <div className="border-l-2 border-amber-400 pl-6 relative">
          <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-amber-400" />
          <h4 className="font-serif text-xl text-gray-900 dark:text-white">
            Senior Systems Engineer
          </h4>
          <p className="font-mono text-xs text-gray-500 dark:text-gray-400 mt-1">
            2022 — Present
          </p>
          <p className="text-gray-600 dark:text-gray-300 mt-3 leading-relaxed">
            Leading development of AI-powered applications and infrastructure.
            Building scalable systems that serve millions of requests.
          </p>
        </div>

        <div className="border-l-2 border-gray-300 dark:border-gray-700 pl-6 relative">
          <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700" />
          <h4 className="font-serif text-xl text-gray-900 dark:text-white">
            Full Stack Developer
          </h4>
          <p className="font-mono text-xs text-gray-500 dark:text-gray-400 mt-1">
            2019 — 2022
          </p>
          <p className="text-gray-600 dark:text-gray-300 mt-3 leading-relaxed">
            Developed web applications and APIs for enterprise clients.
            Implemented CI/CD pipelines and improved deployment workflows.
          </p>
        </div>
      </div>
    </SchematicCard>
  </div>
);

/**
 * Blog Content Section
 */
const BlogContent: React.FC = () => {
  const [simplifiedPosts, setSimplifiedPosts] = useState<Set<string>>(new Set());

  const toggleSimplify = (id: string) => {
    setSimplifiedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const posts = [
    {
      id: '1',
      tag: 'AI Engineering',
      date: 'JAN 15, 2026',
      complex: {
        title: 'The Architecture of Modern AI Agents',
        preview:
          'Exploring the fundamental patterns behind autonomous AI systems, from perception-action loops to hierarchical planning structures.',
      },
      simple: {
        title: 'How AI Assistants Work',
        preview:
          "A simple explanation of how modern AI assistants like ChatGPT process your requests and generate responses.",
      },
    },
    {
      id: '2',
      tag: 'Web Dev',
      date: 'DEC 28, 2025',
      complex: {
        title: 'WebGL Shaders: A Deep Dive',
        preview:
          'Understanding fragment and vertex shaders, GLSL programming, and real-time graphics rendering in the browser.',
      },
      simple: {
        title: '3D Graphics in Your Browser',
        preview:
          'How websites create those cool 3D effects you see, explained without the technical jargon.',
      },
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 pb-32">
      <div className="text-center mb-12 relative">
        <h2 className="font-mono text-xs tracking-[0.5em] text-red-900/40 dark:text-red-300/40 uppercase relative z-10 bg-[#F3F4F6] dark:bg-[#030712] inline-block px-4">
          Transmission Log
        </h2>
        <div className="absolute top-1/2 left-0 w-full h-px bg-red-900/10 dark:bg-red-400/10 -z-0" />
      </div>

      {posts.map((post) => {
        const isSimple = simplifiedPosts.has(post.id);
        const content = isSimple ? post.simple : post.complex;

        return (
          <SchematicCard
            key={post.id}
            className="cursor-default"
            date={post.date}
            badge={post.tag}
            noPadding
          >
            {/* Toggle Control Bar */}
            <div className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 px-8 py-3 flex justify-end">
              <button
                onClick={() => toggleSimplify(post.id)}
                className="flex items-center gap-3 group"
              >
                <span
                  className={`font-mono text-[9px] uppercase tracking-widest transition-colors ${
                    isSimple
                      ? 'text-gray-400 dark:text-gray-600'
                      : 'text-red-600 dark:text-red-400 font-bold'
                  }`}
                >
                  Technical
                </span>

                {/* Switch UI */}
                <div
                  className={`w-8 h-4 rounded-full border relative transition-colors duration-300 ${
                    isSimple
                      ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
                      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-2.5 h-2.5 rounded-full shadow-sm transition-all duration-300 ${
                      isSimple
                        ? 'left-[calc(100%-14px)] bg-amber-500'
                        : 'left-0.5 bg-red-500'
                    }`}
                  />
                </div>

                <span
                  className={`font-mono text-[9px] uppercase tracking-widest transition-colors ${
                    isSimple
                      ? 'text-amber-600 dark:text-amber-500 font-bold'
                      : 'text-gray-400 dark:text-gray-600'
                  }`}
                >
                  Simple
                </span>
              </button>
            </div>

            <div className="p-8">
              <div className="transition-all duration-500 min-h-[160px]">
                <h3 className="text-3xl font-serif text-gray-900 dark:text-gray-100 mb-4 leading-tight">
                  {content.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 font-sans leading-relaxed text-lg">
                  {content.preview}
                </p>
              </div>

              <div className="mt-8 flex justify-between items-center border-t border-gray-100 dark:border-gray-800 pt-6">
                <div className="font-mono text-[10px] text-gray-300 dark:text-gray-600 flex items-center gap-2">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSimple ? 'bg-amber-400' : 'bg-red-500'
                    }`}
                  />
                  {isSimple ? 'DECRYPTED' : 'ENCRYPTED'}
                </div>
                <button className="flex items-center gap-2 text-gray-900 dark:text-gray-100 text-sm font-bold hover:text-red-600 dark:hover:text-red-400 transition-colors group">
                  Read Full Log{' '}
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </button>
              </div>
            </div>
          </SchematicCard>
        );
      })}
    </div>
  );
};

/**
 * Contact Content Section
 */
const ContactContent: React.FC = () => (
  <div className="w-full h-full flex items-center justify-center pb-32">
    <SchematicCard className="w-full max-w-lg text-center !p-12">
      <div className="mb-10 relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="w-32 h-32 border border-red-100 dark:border-red-900 rounded-full animate-pulse" />
        </div>
        <h2 className="font-serif text-5xl text-gray-900 dark:text-white italic mb-2 relative z-10">
          Initiate Uplink
        </h2>
        <div className="h-px w-24 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto mt-6" />
      </div>

      <p className="text-gray-500 dark:text-gray-400 mb-8 font-sans">
        Secure channels are open for collaboration, consultation, or theoretical
        discussion.
      </p>

      <div className="grid grid-cols-1 gap-4">
        <a
          href="mailto:contact@julesai.dev"
          className="flex items-center justify-between p-5 bg-white dark:bg-gray-900 hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg transition-all group hover:border-gray-900 dark:hover:border-white shadow-sm hover:shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-900 group-hover:bg-white transition-colors">
              @
            </div>
            <div className="text-left">
              <div className="font-mono text-[10px] text-gray-400 dark:text-gray-500 group-hover:text-gray-500 uppercase tracking-widest">
                Email
              </div>
              <div className="font-serif text-lg">contact@julesai.dev</div>
            </div>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-500">
            →
          </div>
        </a>

        <a
          href="https://github.com/jujubear24"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-5 bg-white dark:bg-gray-900 hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg transition-all group hover:border-gray-900 dark:hover:border-white shadow-sm hover:shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-900 group-hover:bg-white transition-colors">
              #
            </div>
            <div className="text-left">
              <div className="font-mono text-[10px] text-gray-400 dark:text-gray-500 group-hover:text-gray-500 uppercase tracking-widest">
                GitHub
              </div>
              <div className="font-serif text-lg">@jujubear24</div>
            </div>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-500">
            →
          </div>
        </a>
      </div>
    </SchematicCard>
  </div>
);

/**
 * Main ContentOverlay Component
 */
const ContentOverlay: React.FC<ContentOverlayProps> = ({ mode }) => {
  return (
    <div className="w-full min-h-full px-6 py-28 md:py-32 pointer-events-auto">
      {mode === 'RESUME' && <ResumeContent />}
      {mode === 'BLOG' && <BlogContent />}
      {mode === 'CONTACT' && <ContactContent />}
    </div>
  );
};

export default ContentOverlay;