# PeriodicIngestor

The periodic ingestor checks periodically if any events should be processed and inserted into BQ, validates them and then does an insert if everything is OK, there are two types of queue backends one in memory (useful in tests) and one based on Redis (useful in production).
