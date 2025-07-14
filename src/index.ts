#!/usr/bin/env node

import { z } from "zod";
import { FastMCP, UserError } from "fastmcp";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import Fuse from "fuse.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = new FastMCP({
  name: "@mcpjam/mcp-spec",
  version: "1.0.8",
});

const documentChunks: {
  id: number;
  content: string;
  section: string;
  line: number;
}[] = [];

let fuse: Fuse<(typeof documentChunks)[0]>;

function loadAndIndexDocument(): Fuse<(typeof documentChunks)[0]> | undefined {
  try {
    const docPath = join(__dirname, "../src/lib/llms-full.md");
    const content = readFileSync(docPath, "utf-8");
    const lines = content.split("\n");

    let currentSection = "Overview";
    let chunkId = 0;
    let chunkContent = "";
    let chunkStartLine = 1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.match(/^# /)) {
        if (chunkContent.trim()) {
          documentChunks.push({
            id: chunkId,
            content: chunkContent.trim(),
            section: currentSection,
            line: chunkStartLine,
          });
          chunkId++;
        }

        currentSection = line.replace(/^#+\s*/, "");
        chunkContent = line + "\n";
        chunkStartLine = i + 1;
      } else {
        chunkContent += line + "\n";

        // Create chunks of reasonable size (~500 lines)
        if (chunkContent.split("\n").length > 500) {
          documentChunks.push({
            id: chunkId,
            content: chunkContent.trim(),
            section: currentSection,
            line: chunkStartLine,
          });
          chunkId++;
          chunkContent = "";
          chunkStartLine = i + 1;
        }
      }
    }

    // Add final chunk
    if (chunkContent.trim()) {
      documentChunks.push({
        id: chunkId,
        content: chunkContent.trim(),
        section: currentSection,
        line: chunkStartLine,
      });
    }

    // Initialize Fuse.js search
    fuse = new Fuse(documentChunks, {
      keys: ["content", "section"],
      threshold: 0.3,
      includeScore: true,
    });

    return fuse;
  } catch (error) {
    console.error("Failed to load document:", error);
  }
}

server.addTool({
  name: "mcpjam_search_mcp_spec",
  description: "Search the MCP specification document for relevant content",
  parameters: z.object({
    query: z
      .enum([
        "Introduction",
        "Core components",
        "Connection lifecycle",
        "Elicitation",
        "Prompts",
        "Resources",
        "Roots",
        "Sampling",
        "Tools",
        "Transports",
        "Debugging",
        "Follow logs in real-time",
        "For Client Developers",
        "For Server Developers",
        "Architecture",
        "Authorization",
        "Lifecycle",
        "Security Best Practices",
        "Transports",
        "Cancellation",
        "Ping",
        "Progress",
        "Elicitation",
        "Roots",
        "Sampling",
        "Specification",
        "Overview",
        "Prompts",
        "Resources",
        "Tools",
        "Completion",
        "Logging",
        "Pagination",
        "Versioning",
      ])
      .describe(
        "Select a specific section of the MCP specification to retrieve."
      ),
  }),
  execute: async (args) => {
    const fuse = loadAndIndexDocument();
    try {
      if (!fuse) {
        throw new UserError("Search index not initialized. Please try again.");
      }

      // Find exact section match
      const matchingChunk = documentChunks.find(
        (chunk) => chunk.section === args.query
      );

      if (!matchingChunk) {
        return `No section found with the name "${args.query}".`;
      }

      return JSON.stringify(
        {
          content: matchingChunk.content,
        },
        null,
        2
      );
    } catch (error) {
      return `Search error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`;
    }
  },
});

server.start({
  transportType: "stdio",
});
