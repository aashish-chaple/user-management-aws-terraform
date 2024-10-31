import StatsD from 'statsd-client';

const statsd = new StatsD({ host: 'localhost', port: 8125 });

export default statsd;