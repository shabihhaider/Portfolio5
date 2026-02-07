
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const RICH_CONTENT = `
# The Future of AI in Web Development

Artificial Intelligence is revolutionizing how we build the web. From **code generation** to *automated testing*, the landscape is shifting correctly.

## 1. Code Generation
Tools like GitHub Copilot and Cursor are changing how we write code.

\`\`\`javascript
const ai = "helper";
console.log(\`Coding with \${ai} is faster\`);
\`\`\`

## 2. Automated Testing
AI can write tests for us.

> "The best code is the code you don't have to write."

## 3. Design to Code
Imagine drawing a sketch and having it converted to React components instantly.

### Key Takeaways
- AI is a tool, not a replacement.
- Learn to prompt engineering.
- Focus on architecture.
`;

async function main() {
    console.log('✨ Polishing content...');

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // Update the first post
    const updated = await prisma.post.updateMany({
        where: {
            slug: 'future-of-ai-web-development'
        },
        data: {
            content: RICH_CONTENT,
            coverImage: `${siteUrl}/api/og?title=Future%20of%20AI&tags=AI,Web,Dev`,
            status: 'draft', // Reset to draft so they can test publish
        },
    });

    console.log(`✅ Updated ${updated.count} posts with rich content.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
