# Prometheus metrics exporter


## Links

- [Metrics types to use in your application](https://prometheus.io/docs/concepts/metric_types/)
- [Who to name metrics and best practices](https://prometheus.io/docs/practices/naming/)
- [NodeJS prometheus exporter](https://github.com/siimon/prom-client)
- [NodeJS prometheus exporter examples](https://github.com/siimon/prom-client/blob/master/example/server.js)


## Prometheus scratch metrics endpoint

Usually you would want to expose your application metrics via **/metrics** endpoint.

## Log events metrics

Generally a json log event contains several fields like `message`, `level` and hopefully others :). In order to export log event metrics it's sufficient only a few these fields. The first one is **level**, since obviously we want to know the number of magnitude of errors, infos and warnings. The second could be `message`, but please **do not use it**.
Messages tend to be a random text describing a particular event. A better choice to introduce an **event type** (`event_type`) which will stand for a short and unique identifier of an event.

Due to the nature of log events the suitable metric type would be a **counter**, since there's the only task to estimate the number of log events happening.

The sample code is available [log events exporter](log-events-exporter.js), container [plasmops/promexp-examples:logevents](https://hub.docker.com/r/plasmops/promexp-examples/).

### Example

```bash
docker run --rm -it -p 80:80 plasmops/promexp-examples:logevents

# wait for a while
curl http://localhost/metrics
```
