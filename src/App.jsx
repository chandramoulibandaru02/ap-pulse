const categories = ['World', 'Business', 'Health', 'Culture', 'Science', 'Tech'];

const topStories = [
  {
    title: 'City transit expansion brings faster commutes to thousands of riders',
    summary: 'New rail lines and bus lanes cut travel times in key corridors across the metro area.',
    tag: 'Transit'
  },
  {
    title: 'Local startups attract fresh funding as innovation hub gains momentum',
    summary: 'Investors are backing climate, health, and AI ventures as the region builds a stronger ecosystem.',
    tag: 'Business'
  },
  {
    title: 'Community health workers lead a new push to improve neighborhood care',
    summary: 'Program leaders say early screenings and outreach are already improving access in underserved areas.',
    tag: 'Health'
  }
];

const briefings = [
  { label: 'Markets', value: 'Dow up 1.4%' },
  { label: 'Weather', value: 'Sunny, 26°C' },
  { label: 'Traffic', value: 'Light delays north' },
  { label: 'Election', value: 'Turnout climbs' }
];

const latestNews = [
  {
    title: 'New waterfront district plans to open this spring with cultural venues',
    category: 'Urban Life',
    time: '8 min ago'
  },
  {
    title: 'Researchers unveil a cleaner battery prototype for everyday electronics',
    category: 'Science',
    time: '21 min ago'
  },
  {
    title: 'Small businesses adopt AI tools to streamline customer service',
    category: 'Tech',
    time: '39 min ago'
  },
  {
    title: 'Festival organizers expand free programming for families this weekend',
    category: 'Culture',
    time: '1 hour ago'
  }
];

const editorial = [
  {
    title: 'Why slower growth may still bring better urban planning',
    author: 'Maya Chen'
  },
  {
    title: 'The return of neighborhood newsrooms and what they mean for trust',
    author: 'Jordan Patel'
  },
  {
    title: 'Five ways climate resilience is reshaping local infrastructure',
    author: 'Leah Gomez'
  }
];

export default function App() {
  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="brand-block">
          <span className="brand-mark">CW</span>
          <div>
            <p className="eyebrow">Morning briefing</p>
            <h1>CityWire</h1>
          </div>
        </div>

        <nav className="main-nav" aria-label="Main navigation">
          {categories.map((category) => (
            <a href="#" key={category}>{category}</a>
          ))}
        </nav>

        <button className="subscribe-btn">Subscribe</button>
      </header>

      <div className="ticker" aria-label="Trending topics">
        <span>LIVE</span>
        <p>Election turnout surges in the city • Transit launch expands service • Local startup funding hits new record</p>
      </div>

      <main className="content-grid">
        <section className="lead-story">
          <div className="story-overlay" />
          <div className="story-copy">
            <span className="story-tag">Front page</span>
            <h2>Public spaces reopen with greener streets and stronger neighborhood gathering points</h2>
            <p>
              City planners are redesigning downtown corridors around community use, safety, and cleaner air as residents return to shared spaces.
            </p>
            <div className="story-meta">
              <span>By Elena Brooks</span>
              <span>6 min read</span>
            </div>
          </div>
        </section>

        <aside className="mini-panel">
          <div className="panel-header">
            <h3>Top stories</h3>
            <span>Updated 5m ago</span>
          </div>

          {topStories.map((story) => (
            <article key={story.title} className="mini-card">
              <span className="card-tag">{story.tag}</span>
              <h4>{story.title}</h4>
              <p>{story.summary}</p>
            </article>
          ))}
        </aside>

        <section className="briefing-strip">
          {briefings.map((item) => (
            <div key={item.label} className="briefing-item">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </section>

        <section className="latest-section">
          <div className="section-heading">
            <h3>Latest</h3>
            <a href="#">View all</a>
          </div>

          <div className="news-list">
            {latestNews.map((item) => (
              <article key={item.title} className="news-item">
                <div>
                  <span className="news-category">{item.category}</span>
                  <h4>{item.title}</h4>
                </div>
                <time>{item.time}</time>
              </article>
            ))}
          </div>
        </section>

        <aside className="editorial-panel">
          <div className="section-heading">
            <h3>Opinion</h3>
            <a href="#">More</a>
          </div>

          <div className="editorial-list">
            {editorial.map((item) => (
              <article key={item.title} className="editorial-item">
                <h4>{item.title}</h4>
                <span>{item.author}</span>
              </article>
            ))}
          </div>
        </aside>
      </main>
    </div>
  );
}
