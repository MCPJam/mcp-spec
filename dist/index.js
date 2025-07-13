#!/usr/bin/env node
import { z } from "zod";
import { FastMCP } from "fastmcp";
const server = new FastMCP({
    name: "@mcpjam/mcp-spec",
    version: "1.0.7",
});
server.addTool({
    name: "add",
    description: "Add two numbers",
    parameters: z.object({
        a: z.number(),
        b: z.number(),
    }),
    execute: async (args) => {
        return String(args.a + args.b);
    },
});
server.start({
    transportType: "stdio",
});
//# sourceMappingURL=index.js.map