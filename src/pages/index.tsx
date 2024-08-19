import { Inter } from "next/font/google";
import Link from "next/link";
import CodeMirror from "@uiw/react-codemirror";
import { inlineSuggestion } from "codemirror-extension-inline-suggestion";
import { EditorState } from "@codemirror/state";
import * as webllm from "@mlc-ai/web-llm";
import { useState, useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [engine, setEngine] = useState<webllm.MLCEngineInterface | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');

  useEffect(() => {
    async function loadWebLLM() {
      setIsLoading(true);
      const initProgressCallback = (report: webllm.InitProgressReport) => {
        setLoadingStatus(report.text);
      };

      const selectedModel = "SmolLM-360M-q016-MLC";
      const appConfig: webllm.AppConfig = {
        model_list: [{
          model: `https://huggingface.co/cfahlgren1/SmolLM-360M-q016-MLC`,
          model_id: 'SmolLM-360M-q016-MLC',
          model_lib: `${webllm.modelLibURLPrefix}${webllm.modelVersion}/SmolLM-360M-Instruct-q0f16-ctx2k_cs1k-webgpu.wasm`,
          overrides: { context_window_size: 2048 },
        }],
      };

      try {
        const newEngine = await webllm.CreateMLCEngine(selectedModel, {
          appConfig,
          initProgressCallback,
          logLevel: "INFO",
        });
        setEngine(newEngine);
      } catch (err) {
        console.error(`Failed to load the model: ${(err as Error).message}`);
      } finally {
        setIsLoading(false);
      }
    }

    loadWebLLM();
  }, []);

  const generateCompletion = async (content: string) => {
    if (!engine) return;

    try {
      const response = await engine.completions.create({
        prompt: content,
        max_tokens: 15,
      });
      return response.choices[0].text || "";
    } catch (err) {
      console.error(`Error: ${(err as Error).message}`);
      return "";
    }
  };

  return (
    <div>
      <h1 className="text-6xl text-slate-800 mt-28 font-bold font-sans text-center">
        Smol<span className="text-red-600">Pilot</span>
      </h1>
      <p className="text-slate-800 italic text-sm mb-4 mt-2 text-center">
        What if you had a <Link className="text-black underline font-semibold" href="https://huggingface.co/HuggingFaceTB/SmolLM-360M" target="_blank">360M parameter model</Link> in your pocket?
      </p>
      {isLoading ? (
        <p className="text-center mt-4">{loadingStatus}</p>
      ) : (
        <div className="flex flex-col items-center mt-10">
          <div className="w-full border-2 border-slate-200 shadow-2xl rounded-lg max-w-4xl">
            <CodeMirror
              placeholder="Type anything to suggest a word"
              height="400px"
              extensions={[
                inlineSuggestion({
                  fetchFn: async (state: EditorState) => {
                    const content = state.doc.toString();
                    return (await generateCompletion(content)) || "";
                  },
                  delay: 500
                })
              ]}
            />
          </div>
          <p className="text-slate-800 italic text-sm mt-2 text-center">
            Keep in mind, this is a 360M parameter model, it&apos;s not Llama 3.1 405B 🤗
          </p>
        </div>
      )}
    </div>
  );
}