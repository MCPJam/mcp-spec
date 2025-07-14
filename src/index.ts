#!/usr/bin/env node

import { z } from "zod";
import { FastMCP } from "fastmcp";
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

      if (line.match(/^##+ /)) {
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
  name: "search_mcp_spec",
  description: "Search the MCP specification document for relevant content",
  parameters: z.object({
    query: z.string().describe("Search query for the MCP specification"),
    limit: z
      .number()
      .optional()
      .default(5)
      .describe("Maximum number of results to return (default: 5)"),
  }),
  execute: async (args) => {
    const fuse = loadAndIndexDocument();
    try {
      if (!fuse) {
        return "Search index not initialized. Please try again.";
      }

      const results = fuse.search(args.query).slice(0, args.limit);

      if (results.length === 0) {
        return "No results found for your query.";
      }

      const searchResults = results.map((result) => {
        const chunk = result.item;

        return {
          section: chunk.section,
          line: chunk.line,
          content: chunk.content,
          score: result.score ? (1 - result.score).toFixed(3) : "N/A",
        };
      });

      return JSON.stringify(
        {
          query: args.query,
          totalResults: results.length,
          results: searchResults,
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

// Load document on startup

server.start({
  transportType: "stdio",
});
