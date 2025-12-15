# Turbulent Brushstrokes — Categorical Van Gogh

A generative art piece for museum projection using **authentic Van Gogh brushwork patterns** per artistic period, with **Kolmogorov turbulence modeling** for The Starry Night.

## Scientific Basis

This visualization is grounded in peer-reviewed research:

- **Aragon et al.** - "Turbulent Luminance in Impassioned van Gogh Paintings" (2006)
- **Kolmogorov's -5/3 power law** for turbulent energy cascade across eddy scales
- **Batchelor scaling** for small-scale mixing in turbulent flows

The Starry Night period recreates the **14 main eddies** identified in the painting, with energy distribution following the mathematical `-5/3` exponent that Van Gogh intuitively captured decades before Kolmogorov formalized turbulence theory.

## Authentic Brushstroke Techniques

Each period uses historically accurate rendering:

| Period | Technique | Visual Rendering |
|--------|-----------|------------------|
| **Nuenen (1885)** | Heavy impasto | Short, thick rectangular dabs with highlight ridges |
| **Paris (1886-87)** | Pointillism | Circular dots with complementary color neighbors |
| **Arles (1888)** | Directional impasto | Long parallel strokes, square-capped, bold flow |
| **Starry Night (1889)** | Turbulent swirls | Curved strokes around 14 multi-scale eddies |
| **Almond Blossoms (1890)** | Japanese curves | Smooth, flowing bezier-like strokes |

## Running the Visualization

```bash
cd viz
python -m http.server 8000
# Open http://localhost:8000
```

Or use any local server (Node's `npx serve .`, VS Code Live Server, etc.)

## Controls

| Key | Action |
|-----|--------|
| `1` | The Potato Eaters (Nuenen, 1885) — Heavy impasto |
| `2` | Neo-Impressionist Light (Paris, 1886-87) — Pointillist dots |
| `3` | Sunflowers (Arles, 1888) — Directional strokes |
| `4` | The Starry Night (Saint-Rémy, 1889) — Kolmogorov turbulence |
| `5` | Almond Blossoms (Saint-Rémy, 1890) — Japanese curves |
| `SPACE` | Pause/Resume |
| `R` | Reset particles and eddies |
| `F` | Toggle fullscreen |
| `H` | Hide/show info overlay |

## Museum Projection Notes

- Press `F` for fullscreen, `H` to hide overlay for clean projection
- Auto-cycles through all 5 periods (35 seconds each)
- In Starry Night mode, mouse movement creates interactive swirls
- The visualization responds to screen size — works on any aspect ratio

## Technical Implementation

### Kolmogorov Turbulence Model

The Starry Night period implements:

```
E(k) ∝ k^(-5/3)  — Energy distribution across eddy scales
```

- **14 eddies** at multiple scales (large sky swirls → small detail eddies)
- Larger eddies contain more energy (inverse power law)
- Eddies pulse and drift over time
- Particle paths follow weighted sum of all eddy influences

### Period-Specific Flow Fields

- **Impasto**: Blocky, chunky noise with slow evolution
- **Pointillist**: Jittery, semi-random for stippled effect
- **Directional**: Strong dominant angle with radiating center (sunflower)
- **Turbulent**: Multi-scale eddy superposition
- **Flowing**: Smooth noise with wave patterns and upward bias

## References

- [Nature News: Van Gogh painted perfect turbulence](https://www.nature.com/news/2006/060703/full/news060703-17.html)
- [Hidden turbulence in van Gogh's The Starry Night (2024)](https://pubs.aip.org/aip/pof/article/36/9/095140/3312767/Hidden-turbulence-in-van-Gogh-s-The-Starry-Night)
- [Draw Paint Academy: Van Gogh Techniques](https://drawpaintacademy.com/vincent-van-gogh-techniques/)
- [Van Gogh Studio: Impasto Technique](https://www.vangoghstudio.com/did-van-gogh-use-impasto/)
