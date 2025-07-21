# All Products Page - Filter System Documentation

A comprehensive product filtering system with search functionality and dynamic filters.

## 🚀 Quick Overview

This system allows users to filter products by:
- **Categories**: Disinfectants, Equipment
- **Product Types**: Dynamic list from database
- **Medical Fields**: Stomatologie, Medicina generala  
- **Search**: Real-time text search

## 📋 Component Structure

```
AllProductsPage/
├── ProductFiltersComponent.tsx    # Filter sidebar
├── FilteredProductsGrid.tsx       # Product results grid
├── ProductSearch.tsx             # Search input
└── README.md                     # Documentation
```

## 🔄 Data Flow (End-to-End)

### 1. Initial Load
```
useGetProducts() → Raw product data
useGetProductTypes() → Filter options
```

### 2. User Interaction → State Updates
```
User checks filter → onFiltersChange() → setFilters() → Re-render
User types search → onSearchChange() → setSearchQuery() → Re-render
```

### 3. Filtering Process
```
products + filters + searchQuery → filterProducts() → filtered results
filtered results → ProductCard components → UI display
```

### 4. Complete Flow Diagram
```
┌─────────────────┐
│   Products DB   │
└─────────┬───────┘
          │
    ┌─────▼─────┐
    │useGetProducts│
    └─────┬─────┘
          │
┌─────────▼─────────┐      ┌─────────────────┐
│   Products Page   │◄────►│  Filter State   │
│  (Orchestrator)   │      │ (categories,    │
└─────────┬─────────┘      │  productTypes,  │
          │                │  medicalFields, │
          │                │  searchQuery)   │
          │                └─────────────────┘
          │
    ┌─────▼─────┐
    │  3 Child  │
    │Components │
    └─────┬─────┘
          │
┌─────────▼─────────┐
│  filterProducts() │ ← lib/utils.ts
│     (utility)     │
└─────────┬─────────┘
          │
    ┌─────▼─────┐
    │ Filtered  │
    │ Results   │
    └───────────┘
```

## 🔍 Filter Logic Explained

### Core Function: `filterProducts(products, filters, searchQuery)`

**Step-by-step filtering process:**

1. **Search Filter** (if searchQuery exists)
   ```typescript
   product.title.includes(searchQuery) ||
   product.description.includes(searchQuery) ||
   product.product_type.type_name.includes(searchQuery)
   ```

2. **Category Filter** (if categories selected)
   ```typescript
   filters.categories.includes(product.category)
   ```

3. **Product Type Filter** (if types selected)
   ```typescript
   filters.productTypes.includes(product.product_type.type_name)
   ```

4. **Medical Field Filter** (if fields selected)
   ```typescript
   if ('stomatologie' selected) → check product.stomatologie === true
   if ('medicina_generala' selected) → check product.medicina_generala === true
   ```

### Filter Combination Logic

**ALL filters must pass** (AND logic):
- If search + category + medical field are active, product must match ALL THREE
- Empty filter arrays are ignored (don't filter)
- Only products passing ALL active filters are shown

## 🎯 Component Responsibilities

### ProductFiltersComponent.tsx
- Renders filter checkboxes
- Handles filter state changes
- Provides "Clear All" functionality

### FilteredProductsGrid.tsx  
- Calls `filterProducts()` utility
- Displays filtered results in responsive grid
- Handles loading/error states

### ProductSearch.tsx
- Real-time search input
- Clear search functionality

### Products Page (Parent)
- Manages all filter state
- Coordinates data flow between components
- Calculates filtered count for display

## 🔧 State Management

```typescript
const [filters, setFilters] = useState<ProductFilters>({
    categories: [],      // ['disinfectants']
    productTypes: [],    // ['Dezinfectant maini']
    medicalFields: []    // ['stomatologie']
});
const [searchQuery, setSearchQuery] = useState(''); // 'alcool'
```

**Filter Updates:**
```typescript
// Adding a filter
onFiltersChange({
    ...filters,
    categories: [...filters.categories, 'disinfectants']
});

// Removing a filter  
onFiltersChange({
    ...filters,
    categories: filters.categories.filter(c => c !== 'disinfectants')
});
```

## ⚡ Performance Features

- **useMemo**: Prevents unnecessary re-filtering
- **Centralized Logic**: Single filtering function for consistency
- **Efficient Updates**: Only re-filters when filters/search/products change

## 📊 Example Usage

**User Journey:**
1. User visits `/products` page
2. Sees all products initially (no filters)
3. Checks "Dezinfectanți" category → Only disinfectants shown
4. Types "mâini" in search → Only hand disinfectants shown  
5. Checks "Stomatologie" → Only hand disinfectants for dentistry shown
6. Clicks "Clear All" → Back to all products

**Filter State Progression:**
```typescript
// Initial state
{ categories: [], productTypes: [], medicalFields: [] }

// After selecting category
{ categories: ['disinfectants'], productTypes: [], medicalFields: [] }

// After search + medical field
{ categories: ['disinfectants'], productTypes: [], medicalFields: ['stomatologie'] }
// + searchQuery: 'mâini'

// After clear all
{ categories: [], productTypes: [], medicalFields: [] }
// + searchQuery: ''
```

---

**Architecture**: Centralized utility functions + component composition  
**Performance**: Memoized filtering + efficient state updates  
**UX**: Real-time filtering + clear visual feedback  
