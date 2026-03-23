# n8n-nodes-toneapi

Community node for [n8n](https://n8n.io/) that integrates with the [Tone API](https://dashboard.bracherai.com/docs) — analyze tone, detect emotions, and rewrite text.

## Installation

### Community Nodes (recommended)

In n8n, go to **Settings > Community Nodes > Install** and enter:

```
n8n-nodes-toneapi
```

### Docker (self-hosted)

```bash
docker exec -it n8n sh -c "cd /home/node/.n8n/nodes && npm install n8n-nodes-toneapi"
docker restart n8n
```

## Setup

1. Get an API key at [dashboard.bracherai.com](https://dashboard.bracherai.com)
2. In n8n, add the **Tone API** node to a workflow
3. Create credentials with your API key (starts with `tone_`)

## Operations

| Operation | Description |
|-----------|-------------|
| **Analyze Tone** | Returns scores for rudeness, assertiveness, confidence, urgency, and vagueness |
| **Detect Emotion** | Detects primary emotion (joy, anger, sadness, fear, surprise, disgust, neutral) with scores |
| **Rewrite** | Rewrites text in a professional or custom target tone |
| **Get Key Info** | Returns remaining credits, total calls, and recent usage logs |

## Resources

- [API Documentation](https://dashboard.bracherai.com/docs)
- [Get an API Key](https://dashboard.bracherai.com/register)

## License

MIT
