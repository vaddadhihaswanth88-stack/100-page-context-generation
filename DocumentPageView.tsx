import ReactMarkdown from 'react-markdown';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, AreaChart, Area, ResponsiveContainer } from 'recharts';
import type { DocumentPage, DocumentOutline, ChartData } from '@/types/document';

interface Props {
  page: DocumentPage;
  outline: DocumentOutline;
  totalPages: number;
}

const ChartRenderer = ({ chart }: { chart: ChartData }) => {
  const colors = chart.data.map(d => d.fill || '#10B981');

  return (
    <div className="my-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h4 className="text-sm font-semibold text-gray-700 mb-3 font-sans">{chart.title}</h4>
      <div className="flex justify-center">
        <ResponsiveContainer width="100%" height={220}>
          {chart.type === 'pie' ? (
            <PieChart>
              <Pie data={chart.data} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}%`} labelLine={false}>
                {chart.data.map((_, i) => <Cell key={i} fill={colors[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          ) : chart.type === 'bar' ? (
            <BarChart data={chart.data}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chart.data.map((_, i) => <Cell key={i} fill={colors[i]} />)}
              </Bar>
            </BarChart>
          ) : chart.type === 'line' ? (
            <LineChart data={chart.data}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981' }} />
            </LineChart>
          ) : chart.type === 'area' ? (
            <AreaChart data={chart.data}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#10B981" fill="#10B98133" strokeWidth={2} />
            </AreaChart>
          ) : (
            <BarChart data={chart.data} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={100} />
              <Tooltip />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {chart.data.map((_, i) => <Cell key={i} fill={colors[i]} />)}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-gray-500 mt-2 italic">{chart.description}</p>
    </div>
  );
};

const DocumentPageView = ({ page, outline, totalPages }: Props) => {
  if (page.isTitle) {
    return (
      <div className="doc-page flex flex-col items-center justify-center text-center" style={{ maxWidth: '8.5in' }}>
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-16 h-1 bg-emerald-500 mb-8 rounded-full" />
          <h1 className="text-4xl font-black mb-4" style={{ color: '#0f172a' }}>{outline.title}</h1>
          <p className="text-lg mb-2" style={{ color: '#475569' }}>Comprehensive Professional Analysis</p>
          <div className="w-16 h-1 bg-emerald-500 mt-8 mb-8 rounded-full" />
          <p className="text-sm" style={{ color: '#94a3b8' }}>
            Generated on {new Date(outline.generatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>{totalPages} Pages</p>
        </div>
        <div className="page-number">i</div>
      </div>
    );
  }

  if (page.isToc) {
    return (
      <div className="doc-page" style={{ maxWidth: '8.5in' }}>
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#0f172a' }}>Table of Contents</h1>
        {outline.chapters.map((ch) => (
          <div key={ch.number} className="mb-4">
            <div className="flex items-baseline gap-2 font-semibold text-sm" style={{ color: '#10B981' }}>
              <span>Chapter {ch.number}</span>
              <span className="flex-1 border-b border-dotted border-gray-300" />
            </div>
            <div className="text-sm font-medium mb-1" style={{ color: '#1e293b' }}>{ch.title}</div>
            {ch.sections.map((s) => (
              <div key={s.number} className="flex items-baseline gap-2 pl-4 text-xs" style={{ color: '#64748b' }}>
                <span>{s.number}</span>
                <span>{s.title}</span>
                <span className="flex-1 border-b border-dotted border-gray-200" />
              </div>
            ))}
          </div>
        ))}
        <div className="page-number">ii</div>
      </div>
    );
  }

  return (
    <div className="doc-page" style={{ maxWidth: '8.5in' }}>
      <div className="text-xs mb-4 pb-2 border-b border-gray-200 flex justify-between" style={{ color: '#94a3b8', fontFamily: 'Inter, sans-serif' }}>
        <span>Chapter {page.chapterNumber}: {page.chapterTitle}</span>
        <span>{outline.title}</span>
      </div>

      <div className="prose prose-sm max-w-none">
        <ReactMarkdown
          components={{
            h2: ({ children }) => <h2 className="text-xl font-semibold mt-6 mb-3" style={{ color: '#0f172a', fontFamily: 'Inter, sans-serif' }}>{children}</h2>,
            h3: ({ children }) => <h3 className="text-lg font-medium mt-4 mb-2" style={{ color: '#1e293b', fontFamily: 'Inter, sans-serif' }}>{children}</h3>,
            p: ({ children }) => <p className="mb-3 leading-relaxed" style={{ color: '#374151' }}>{children}</p>,
            ul: ({ children }) => <ul className="mb-3 pl-6 list-disc" style={{ color: '#374151' }}>{children}</ul>,
            ol: ({ children }) => <ol className="mb-3 pl-6 list-decimal" style={{ color: '#374151' }}>{children}</ol>,
            li: ({ children }) => <li className="mb-1">{children}</li>,
            strong: ({ children }) => <strong className="font-semibold" style={{ color: '#0f172a' }}>{children}</strong>,
          }}
        >
          {page.content}
        </ReactMarkdown>
      </div>

      {page.chart && <ChartRenderer chart={page.chart} />}

      <div className="page-number">{page.pageNumber}</div>
    </div>
  );
};

export default DocumentPageView;
