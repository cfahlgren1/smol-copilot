import Image from "next/image";
import { Inter } from "next/font/google";
import CodeMirror from "@uiw/react-codemirror";
import { inlineSuggestion } from "codemirror-extension-inline-suggestion";
import { EditorState } from "@codemirror/state";

const inter = Inter({ subsets: ["latin"] });

const fetchRandomWord = async (state: EditorState): Promise<string> => {
  if (state.doc.length === 0) {
    return "";
  }
  const res = await fetch(
    `https://random-word-api.herokuapp.com/word?number=5`
  );
  const data = await res.json();
  return data.join(" ");
};

export default function Home() {
  return (
    <div>
      <h1 className="text-6xl text-slate-800 mt-28 font-bold font-sans text-center">
        Smol<span className="text-red-600">Pilot</span>
      </h1>
      <p className="text-slate-800 italic text-sm mb-4 mt-2 text-center">
        What if you had a 350M parameter model in your pocket?
      </p>
      <div className="flex justify-center mt-10">
        <div className="w-full border-2 border-slate-200 shadow-2xl rounded-lg max-w-4xl">
          <CodeMirror
            placeholder="Type anything to suggest a word"
            height="400px"
            extensions={
              [
                inlineSuggestion({
                  fetchFn: fetchRandomWord,
                  delay: 500
                })
              ]
            }
          />
        </div>
      </div>
    </div>
  );
}