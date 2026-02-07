import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import BlogCard from '../BlogCard'
import { BlogPost } from '@/lib/db/schema'

const mockPost: BlogPost = {
    slug: 'test-post',
    title: 'Test Post Title',
    content: 'Test content',
    excerpt: 'This is a test excerpt',
    coverImage: '/test-image.jpg',
    author: 'Test Author',
    publishedAt: new Date('2024-01-01T12:00:00Z'),
    createdAt: new Date('2024-01-01T12:00:00Z'),
    updatedAt: new Date('2024-01-01T12:00:00Z'),
    status: 'published',
    metaDescription: 'Test meta description',
    metaKeywords: ['test', 'jest'],
    tags: ['test', 'jest'],
    category: 'Testing',
    views: 100,
    likes: 10,
    readingTime: '5 min read',
    generatedBy: 'human',
    humanEdited: true,
    qualityScore: 10,
    ctaClicks: 0
}

describe('BlogCard', () => {
    it('renders post title and excerpt', () => {
        render(<BlogCard post={mockPost} />)

        expect(screen.getByText('Test Post Title')).toBeInTheDocument()
        expect(screen.getByText('This is a test excerpt')).toBeInTheDocument()
    })

    it('renders tags correctly', () => {
        render(<BlogCard post={mockPost} />)

        expect(screen.getByText('#test')).toBeInTheDocument()
        expect(screen.getByText('#jest')).toBeInTheDocument()
    })

    it('formats date correctly', () => {
        render(<BlogCard post={mockPost} />)

        expect(screen.getByText(/January 1, 2024/)).toBeInTheDocument()
    })
})
