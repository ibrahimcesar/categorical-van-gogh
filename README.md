# Categorical Van Gogh

> Exploring Vincent van Gogh's artistic universe through the lens of category theory

## Overview

This project applies categorical methods to analyze, formalize, and computationally explore Van Gogh's paintings. Rather than treating art analysis as purely subjective interpretation, we construct mathematical structures that reveal deep patterns in his work—from color relationships to stylistic evolution to the generative grammar of his brushstrokes.

## Motivation

Van Gogh was himself a systematic thinker about art. His letters reveal obsessive attention to color theory, compositional rules, and the relationships between works. Category theory, as the mathematics of structure and relationship, provides a natural language for formalizing these intuitions.

## Core Concepts

### The Category **VG**

We define a category **VG** where:

- **Objects**: Individual paintings, or more abstractly, stylistic/chromatic states
- **Morphisms**: Transformations capturing influence, evolution, or structural similarity
- **Composition**: How influences chain through his development

### Functors as Analytical Lenses

Different analytical approaches become functors from **VG** to other categories:

```
Color : VG → ColorSpace
Composition : VG → GeometricStructure  
Brushwork : VG → DirectionalField
Emotion : VG → AffectiveSpace
```

Each functor preserves structure while revealing different aspects of the work.

## Research Directions

### 1. Style Evolution as a Path Category

Van Gogh's development from the dark Nuenen period (1883-1885) through Paris Impressionism (1886-1888) to the expressive intensity of Arles and Saint-Rémy (1888-1890) forms a directed graph of stylistic states. We model this as a **path category** where:

- Vertices are stylistic configurations
- Edges are transformative events (encountering Japanese prints, meeting Gauguin, hospitalizations)
- Paths represent compositional influence chains

### 2. Chromatic Categories

Van Gogh's color theory—documented extensively in his letters—exhibits categorical structure:

- **Complementary pairs** as adjoint relationships
- **Color harmonies** as natural transformations
- **Palette evolution** as functorial mappings between chromatic systems

His shift from earth tones to pure complementaries (yellow/violet, orange/blue) can be formalized as a functor between color categories.

### 3. Brushstroke Algebras

The directional, rhythmic brushwork of mature Van Gogh exhibits recursive structure. Research has shown his turbulence patterns in *Starry Night* match Kolmogorov's statistical model. We explore:

- **Generative grammars** for brushstroke patterns
- **Operadic structure** in mark-making composition
- **Sheaves** over the canvas modeling local-to-global coherence

### 4. Inter-painting Morphisms

Relationships between paintings—thematic series (Sunflowers, Bedroom), copies after other artists, variations on motifs—form a rich morphism structure. We analyze:

- **The Bedroom** variants as a diagram
- Copies after Millet/Delacroix as functorial translation
- Self-portrait series as an endofunctor

## Computational Tools

### Planned Implementations

- **Color extraction and analysis**: Mapping paintings to chromatic signatures
- **Brushstroke field detection**: Computer vision for directional mark-making
- **Similarity metrics**: Categorical distance between works
- **Visualization**: Interactive exploration of the Van Gogh category

### Tech Stack

- **Rust**: Core analysis algorithms and categorical structures
- **TypeScript**: Visualization and interactive interfaces
- **Python**: Image processing and ML integration

## Project Structure

```
categorical-van-gogh/
├── core/                  # Rust categorical foundations
│   ├── src/
│   │   ├── category.rs    # Category, Functor, NaturalTransformation
│   │   ├── color.rs       # Chromatic analysis
│   │   ├── brushwork.rs   # Directional field extraction
│   │   └── lib.rs
│   └── Cargo.toml
├── analysis/              # Python image processing
│   ├── extract_colors.py
│   ├── detect_strokes.py
│   └── requirements.txt
├── viz/                   # TypeScript visualization
│   ├── src/
│   └── package.json
├── data/                  # Painting metadata and extracted features
│   ├── catalog.json
│   └── features/
└── docs/                  # Research notes and writeups
```

## Related Work

- Kolmogorov turbulence analysis of *Starry Night* (Aragón et al., 2006)
- Computational art history and stylometry
- Category theory in digital humanities
- Van Gogh Museum technical research

## References

### Van Gogh Sources
- *The Letters of Vincent van Gogh* (complete correspondence)
- Van Gogh Museum collection and technical documentation
- Hulsker and De la Faille catalogues raisonnés

### Category Theory
- Mac Lane, *Categories for the Working Mathematician*
- Fong & Spivak, *An Invitation to Applied Category Theory*
- Milewski, *Category Theory for Programmers*

## Contributing

This is an exploratory research project. Contributions welcome in:

- Categorical formalization of art-historical concepts
- Computer vision for painting analysis
- Visualization of categorical structures
- Art-historical expertise and correction

## License

MIT

---

*"I dream of painting and then I paint my dream."* — Vincent van Gogh
