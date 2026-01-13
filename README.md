# Product Listing Page (E-Commerce)

A responsive e-commerce product listing page built with React + Vite.  
It fetches products from a mock API and supports filtering, sorting, favorites, and list virtualization for performance.

## Features
- Product grid with: image, name, price, category, rating
- Filter by:
  - Category
  - Minimum rating
- Sort by price:
  - Low → High
  - High → Low
- Favorites:
  - Add/remove favorites
  - Highlight favorited products
  - “Favorites only” view
  - Favorites persisted in `localStorage`
- Performance:
  - Virtualized grid using `react-window`
  - Lazy-loaded images

## Tech Stack
- React (Vite)
- Tailwind CSS
- react-window (virtualization)
- DummyJSON mock API

## Getting Started

### 1) Install dependencies
```bash
npm install
