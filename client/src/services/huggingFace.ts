import axios from "axios";
import type { Node } from "reactflow";
import type { ChecklistItem } from "../components/CheckListNode";

const getNodeText = (node: Node): string => {
  if (node.type === "sticky") return node.data.text || "";
  if (node.type === "editableNode") return node.data.label || "";
  if (node.type === "checklist") {
    const title = node.data.title || "";
    const itemsText = (node.data.items || [])
      .map((item: ChecklistItem) => item.text)
      .join(", ");
    return `${title}: ${itemsText}`;
  }
  return "";
};

export async function categorizeNodeAPI(nodesToCategorize: Node[]) {
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`;

 const categories = [
    "Bug Report",
    "Feature Request",
    "Question",
    "Task",
    "Key Insight",
    "Decision",
    "anticipation",
    "Immediate",
    "Moat",
    "Prescient",
  ];
  const validNodes = nodesToCategorize.filter(
    (node) => getNodeText(node).trim() !== ""
  );

  if (validNodes.length === 0) {
    return [];
  }

  const promises = validNodes.map(async (node) => {
    try {
      const text = getNodeText(node);

      const response = await axios.post(API_URL, {
        contents: [
          {
            parts: [
              {
                text: `Classify this text into exactly one category. Reply with only the category name, nothing else.\n\nCategories: ${categories.join(", ")}\n\nText: "${text}"`,
              },
            ],
          },
        ],
      });

      const category =
        response.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      return {
        nodeId: node.id,
        category: categories.includes(category) ? category : null,
      };
    } catch (error) {
      console.error(`Failed to categorize node ${node.id}:`, error);
      return { nodeId: node.id, category: null };
    }
  });

  const results = await Promise.all(promises);
  return results.filter((result) => result.category !== null);
}

