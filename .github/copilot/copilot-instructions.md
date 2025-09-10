# GitHub Copilot Instructions for Book Management App

## Project Context
This is a Book Management Web Application (my-story-shelves) built with:
- React + TypeScript
- Vite
- Tailwind CSS
- Shadcn/ui components

## Core Features
- Book listing and management
- Book details viewing
- Book lending system
- Search functionality
- Responsive design

## Code Organization Rules

### Component Structure
```typescript
// Standard component structure
import { FC } from 'react'
import { ComponentProps } from '../types'

export const Component: FC<ComponentProps> = ({ prop1, prop2 }) => {
  // State hooks at the top
  // Custom hooks after state
  // Helper functions
  // Return JSX
}
```

### File Organization
- `/src/components`: UI components
- `/src/pages`: Route pages
- `/src/hooks`: Custom hooks
- `/src/types`: TypeScript types/interfaces
- `/src/lib`: Utility functions
- `/src/assets`: Static assets

### Naming Conventions
- Components: PascalCase (e.g., `BookCard.tsx`)
- Hooks: camelCase with 'use' prefix (e.g., `useBooks.ts`)
- Types: PascalCase with descriptive names (e.g., `BookDetails`)
- Utils: camelCase (e.g., `formatDate`)

## Type Safety Requirements
- Always use TypeScript types/interfaces
- Avoid `any` type
- Use proper type annotations for props
- Define return types for functions

## Component Guidelines
1. Use functional components with hooks
2. Implement error boundaries where needed
3. Keep components focused and single-responsibility
4. Use proper prop types
5. Implement proper loading states

## State Management
- Use React hooks for local state
- Implement custom hooks for reusable logic
- Follow proper state update patterns

## Styling Guidelines
1. Use Tailwind CSS classes
2. Follow shadcn/ui component patterns
3. Maintain responsive design principles
4. Use consistent spacing and layout

## Error Handling
```typescript
// Example error handling pattern
try {
  // Operation
} catch (error) {
  // Log error
  console.error('Error:', error)
  // Show user-friendly message
  toast.error('Something went wrong')
}
```

## Modal Component Pattern
```typescript
// Modal component structure
export const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  children
}) => {
  if (!isOpen) return null
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {children}
    </Dialog>
  )
}
```

## Book Data Structure
```typescript
interface Book {
  id: string
  title: string
  author: string
  coverImage: string
  description: string
  status: 'available' | 'borrowed'
  borrowedBy?: string
  borrowDate?: Date
}
```

## Performance Considerations
1. Use React.memo for expensive renders
2. Implement proper useCallback/useMemo
3. Optimize images and assets
4. Implement proper loading states

## Security Guidelines
1. Validate user inputs
2. Sanitize data before display
3. Implement proper error handling
4. No sensitive data in code

## Testing Approach
1. Test component rendering
2. Test user interactions
3. Test custom hooks
4. Test utility functions

## Documentation Requirements
1. Add JSDoc comments for complex functions
2. Document component props
3. Include usage examples
4. Comment complex logic

## Accessibility Requirements
1. Proper ARIA labels
2. Keyboard navigation support
3. Color contrast compliance
4. Screen reader support

Remember:
- Keep code clean and maintainable
- Follow React best practices
- Maintain type safety
- Consider performance implications
- Follow accessibility guidelines
