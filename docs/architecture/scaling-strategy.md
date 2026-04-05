# Scaling Strategy

Status: Active  
Owner: Founder  
Last Updated: 2026-04-06  
Purpose: Defines how PrepHatch should grow without premature complexity.

## Scaling Order

1. prove one exam works
2. improve content quality and trust
3. add more certifications
4. improve analytics and automation
5. split services only when hard evidence justifies it

## Scale Levers Before New Services

- better caching
- better indexing and queries
- CDN/static optimization
- background jobs where needed
- clear module boundaries in the monolith

## Rule

Do not adopt microservices, event buses, or extra infrastructure unless clear bottlenecks, failure isolation needs, or team size justify them.
