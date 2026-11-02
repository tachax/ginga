import { Col, Row } from 'antd';
import { ChartCard } from '../components/ChartCard';
import styles from './About.module.css';

const FACTS = [
  { label: 'Rows in the CSV', value: '114,000' },
  { label: 'Unique tracks', value: '89,740' },
  { label: 'Genres', value: '114' },
  { label: 'Artists', value: '29,858' },
];

const FEATURES = [
  {
    name: 'Danceability',
    text: 'How easy a track is to dance to, based on tempo, rhythm stability and beat strength. From 0 to 1.',
  },
  {
    name: 'Energy',
    text: 'Intensity and activity. Fast, loud and busy tracks score high; quiet, gentle ones score low.',
  },
  {
    name: 'Valence (happiness)',
    text: 'Musical positiveness. High means cheerful or euphoric, low means sad, tense or angry.',
  },
  {
    name: 'Acousticness',
    text: 'How confident the algorithm is that the track is acoustic rather than electronic.',
  },
  {
    name: 'Speechiness',
    text: 'How much spoken word there is: rap, podcasts and poetry score higher.',
  },
  {
    name: 'Liveness',
    text: 'The chance the track was recorded live, with an audience in the room.',
  },
  {
    name: 'Tempo',
    text: 'The estimated speed of the track, in beats per minute (BPM).',
  },
  {
    name: 'Popularity',
    text: 'A score from 0 to 100 based on how much the track was being played when the data was collected.',
  },
];

export function About() {
  return (
    <>
      <h1 className={`display ${styles.title}`}>About the data</h1>
      <p className={styles.intro}>
        Ginga is built on a public snapshot of Spotify's catalog: about 114,000 tracks across
        114 genres, each one described by a handful of numbers Spotify computes from the audio
        itself. Here is where the data comes from, what's inside, and what to keep in mind when
        reading the charts.
      </p>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <ChartCard title="Where it comes from">
            <p className={styles.text}>
              The <strong>Spotify Tracks Dataset</strong> was put together by Maharshi Pandya
              and is shared openly on Hugging Face and Kaggle. It was collected through
              Spotify's Web API: for each of 114 genres, around 1,000 tracks were pulled along
              with their audio features.
            </p>
            <p className={styles.text}>
              Spotify has since closed its audio-features endpoint to new apps, so datasets
              like this one are a snapshot in time that can't easily be refreshed.
            </p>
            <a
              className={styles.link}
              href="https://huggingface.co/datasets/maharshipandya/spotify-tracks-dataset"
              target="_blank"
              rel="noopener noreferrer"
            >
              View the dataset on Hugging Face ↗
            </a>
          </ChartCard>
        </Col>

        <Col xs={24} lg={12}>
          <ChartCard title="What's inside">
            <div className={styles.facts}>
              {FACTS.map((fact) => (
                <div key={fact.label} className={styles.fact}>
                  <div className={`display ${styles.factValue}`}>{fact.value}</div>
                  <div className={styles.factLabel}>{fact.label}</div>
                </div>
              ))}
            </div>
            <p className={styles.text}>
              The same song can appear under several genres (a track might be tagged both
              samba and mpb), which is why 114,000 rows become 89,740 unique tracks.
            </p>
          </ChartCard>
        </Col>

        <Col xs={24}>
          <ChartCard title="Reading the audio features">
            <dl className={styles.features}>
              {FEATURES.map((feature) => (
                <div key={feature.name} className={styles.feature}>
                  <dt>{feature.name}</dt>
                  <dd>{feature.text}</dd>
                </div>
              ))}
            </dl>
          </ChartCard>
        </Col>

        <Col xs={24} lg={12}>
          <ChartCard title="How Ginga prepared it">
            <ul className={styles.list}>
              <li>The CSV was loaded into PostgreSQL once, with a small seed script.</li>
              <li>Duplicate tracks were merged: one row per track, linked to all of its genres.</li>
              <li>The artists field (stored as "A;B") was split into its own artists table.</li>
              <li>One row with no title or artist was left out.</li>
              <li>Every chart is computed live with SQL. Nothing is precomputed.</li>
            </ul>
          </ChartCard>
        </Col>

        <Col xs={24} lg={12}>
          <ChartCard title="Good to know">
            <ul className={styles.list}>
              <li>
                These numbers come from an algorithm, not from people. "Most danceable" means a
                steady, regular beat, which is why minimal techno and kids' songs top the list
                instead of party hits.
              </li>
              <li>
                Tempo detection sometimes doubles or halves the real speed, and some tracks have
                no detectable tempo. Those are left out of the tempo chart.
              </li>
              <li>
                Genres come from how the tracks were collected. They are useful labels, not a
                definitive classification.
              </li>
              <li>Popularity is frozen at collection time and favors recent listening.</li>
            </ul>
          </ChartCard>
        </Col>
      </Row>

      <p className={styles.footnote}>
        Ginga is a portfolio project and is not affiliated with Spotify.
      </p>
    </>
  );
}
