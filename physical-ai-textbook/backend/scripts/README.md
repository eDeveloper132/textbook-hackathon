# 📜 Backend Scripts

Utility scripts for the Physical AI Textbook backend.

## 📁 Scripts

```
scripts/
└── index_content.py    # Index MDX content to Qdrant
```

## 🔍 index_content.py

**Purpose**: Parse textbook content and upload embeddings to Qdrant for RAG search.

### What It Does

1. **Scans** `../docs/` directory for `.mdx` files
2. **Parses** MDX content, extracting text and metadata
3. **Chunks** content into ~500 token segments with overlap
4. **Generates** embeddings using OpenAI `text-embedding-3-small`
5. **Uploads** vectors to Qdrant collection

### Usage

```bash
cd physical-ai-textbook/backend
python scripts/index_content.py
```

### Requirements

Environment variables must be set:
```env
OPENAI_API_KEY=sk-...
QDRANT_URL=https://your-cluster.qdrant.io:6333
QDRANT_API_KEY=your-api-key
```

### Output

```
Scanning docs directory...
Found 21 MDX files
Processing: intro.mdx
  - Created 5 chunks
Processing: module-1-ros2/01-introduction.mdx
  - Created 8 chunks
...
Generating embeddings...
  - Batch 1/10 complete
  - Batch 2/10 complete
...
Uploading to Qdrant...
  - Collection: physical-ai-textbook
  - Vectors uploaded: 156
Done! Indexed 156 chunks from 21 files.
```

### Qdrant Collection Schema

```python
{
    "id": "uuid",
    "vector": [0.1, 0.2, ...],  # 1536 dimensions
    "payload": {
        "text": "chunk content...",
        "source": "module-1-ros2/01-introduction.mdx",
        "title": "Introduction to ROS2",
        "chunk_index": 0
    }
}
```

### Re-indexing

To update the index after content changes:

```bash
# Delete existing collection and re-index
python scripts/index_content.py --force
```

Or manually delete the collection in Qdrant Cloud dashboard first.

## 🔧 Adding New Scripts

Create new scripts in this directory for:
- Data migrations
- Content validation
- Backup/restore operations
- Analytics/reporting

### Script Template

```python
#!/usr/bin/env python3
"""
Script description here.

Usage:
    python scripts/my_script.py [options]
"""

import os
import sys
from dotenv import load_dotenv

load_dotenv()

def main():
    """Main entry point."""
    # Script logic here
    pass

if __name__ == "__main__":
    main()
```

---

Part of the [Physical AI Textbook Backend](../README.md)
