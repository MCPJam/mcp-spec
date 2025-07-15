# MCP Specification Server

[![npm version](https://img.shields.io/npm/v/@mcpjam/mcp-spec?style=for-the-badge&color=blue)](https://www.npmjs.com/package/@mcpjam/mcp-spec)
[![npm downloads](https://img.shields.io/npm/dm/@mcpjam/mcp-spec?style=for-the-badge&color=green)](https://www.npmjs.com/package/@mcpjam/mcp-spec)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-blue.svg?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Discord](https://img.shields.io/badge/Discord-Join%20Server-5865F2.svg?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/JEnDtz8X6z)
[![smithery badge](https://smithery.ai/badge/@MCPJam/mcp-spec)](https://smithery.ai/server/@MCPJam/mcp-spec)

## Overview

We turned the [Model Context Protocol documentation](https://modelcontextprotocol.io/) into an MCP server so that your LLM can get context on the full MCP specs. Query specific sections like "Tools", "Resources", "Authorization", and 20+ others to get the complete documentation for that section.

### Features

**📚 Complete MCP Specification Access**

- 364KB of comprehensive MCP documentation indexed and searchable
- 25+ distinct sections covering every aspect of the protocol
- Complete section content returned, not just snippets

**⚡ Smart Document Processing**

- Intelligent chunking by major headings (`#` tags)
- 500-line chunk limits for optimal performance
- Fast startup indexing (<1 second)

**🔧 Developer-Focused Sections**

- **Tools** - Function calling and tool execution patterns
- **Resources** - Data access and resource management
- **Authorization** - Security, authentication, and authorization
- **Transports** - Communication layers (stdio, HTTP, SSE)
- **Debugging** - Troubleshooting and development tools
- **Core components** - Protocol architecture fundamentals
- **Connection lifecycle** - Initialization and termination
- And 18+ more specialized sections

**🛠️ Built for MCP Development**

- Perfect for developers building MCP servers or clients
- Reference implementation patterns and best practices
- Complete protocol specifications at your fingertips

## Install with an IDE

Add this server to any MCP-compatible client (Claude Desktop, Cursor, VSCode, Windsurf, etc.):

**Claude Desktop Config:**

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

**Cursor config:**

Chat Settings, Tools / Integrations. Edit `mcp.json`

```json
{
  "mcpServers": {
    "mcp-spec": {
      "command": "npx",
      "args": ["-y", "@mcpjam/mcp-spec@latest"]
    }
  }
}
```

### Installing via Smithery

To install mcp-spec for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@MCPJam/mcp-spec):

```bash
npx -y @smithery/cli install @MCPJam/mcp-spec --client claude
```

## How it works

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   MCP Client    │◄──►│  MCP Spec Server │◄──►│ Specification   │
│   (Claude,      │    │                  │    │ Document        │
│    Your App)    │    │  - Section Index │    │ (llms-full.md)  │
└─────────────────┘    │  - Content Cache │    └─────────────────┘
                       │  - Search Logic  │
                       └──────────────────┘
```

1. Server indexes the complete MCP specification on startup
2. Document is split into sections by major headings
3. Query by section name to get the full content for that section
4. Returns complete documentation for topics like Tools, Resources, Authorization, etc.

## Contributing

Want to improve this server? Here's how:

```bash
# 1. Clone the repository
git clone https://github.com/your-org/mcp-spec.git
cd mcp-spec

# 2. Install dependencies
npm install

# 3. Build the project
npm run build

# 4. Start development server
npm run dev
```

### Development workflow:

1. Fork this repository
2. Create a feature branch: `git checkout -b my-feature`
3. Make your changes
4. Test locally: `npm run build && npm run dev`
5. Submit a pull request

- **Community**: Join the MCP community discussions

---

**Note**: This is an unofficial server created to make the MCP specification more accessible. For official MCP resources and documentation, visit [modelcontextprotocol.io](https://modelcontextprotocol.io/).
