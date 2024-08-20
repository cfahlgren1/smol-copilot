---
title: SmolPilot
emoji: 🌖
colorFrom: indigo
colorTo: pink
sdk: docker
pinned: false
license: mit
app_port: 3000
---

# SmolPilot

A demo of a 360M parameter model in your pocket. Showcasing what the future could look like with small language models in the browser.

- Powered by [SmolLM-360M](https://huggingface.co/HuggingFaceTB/SmolLM-360M)
- Uses [WebLLM](https://github.com/mlc-ai/web-llm) to run the model in the browser on WebGPU.

Yes, the model will hallucinate and repeat itself, but think about the possibilities and have a little fun!

## Why Smol Models?

- **Runs Locally**: No need for expensive servers. Inference is done locally, which makes for low latency and low cost.
- **Privacy**: Data never leaves the browser, fully private.
- **No Lock-In**: You can switch the model or provider easily.
- **Customizable**: You could customize and have a model that is specific to your use case.

![SmolPilot Demo](./media/SmolPilot.gif)