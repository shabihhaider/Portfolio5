import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { author, ogBranding } from '@/lib/config/site';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'Blog Post';
    const tags = searchParams.get('tags')?.split(',') || [];

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: ogBranding.bgColor,
                    backgroundImage: `radial-gradient(circle at 25px 25px, ${ogBranding.dotColor} 2%, transparent 0%), radial-gradient(circle at 75px 75px, ${ogBranding.dotColor} 2%, transparent 0%)`,
                    backgroundSize: '100px 100px',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '80px',
                        alignItems: 'flex-start',
                        maxWidth: '1000px',
                    }}
                >
                    <h1
                        style={{
                            fontSize: '72px',
                            fontWeight: 'bold',
                            background: ogBranding.titleGradient,
                            backgroundClip: 'text',
                            color: 'transparent',
                            marginBottom: '20px',
                            lineHeight: 1.2,
                        }}
                    >
                        {title}
                    </h1>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
                        {tags.map((tag, i) => (
                            <span
                                key={i}
                                style={{
                                    padding: '8px 20px',
                                    background: ogBranding.tagBg,
                                    color: ogBranding.tagColor,
                                    borderRadius: '20px',
                                    fontSize: '24px',
                                    border: `2px solid ${ogBranding.tagBorder}`,
                                }}
                            >
                                #{tag.trim()}
                            </span>
                        ))}
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginTop: 'auto',
                            paddingTop: '40px',
                            gap: '20px',
                        }}
                    >
                        <span style={{ fontSize: '32px', color: '#fff', fontWeight: 'bold' }}>
                            {author.name}
                        </span>
                        <span style={{ fontSize: '24px', color: '#666' }}>•</span>
                        <span style={{ fontSize: '28px', color: '#999' }}>
                            {ogBranding.blogName}
                        </span>
                    </div>
                </div>
            </div>
        ),
        {
            width: ogBranding.width,
            height: ogBranding.height,
        }
    );
}
