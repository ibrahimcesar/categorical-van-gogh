# Turbulent Brushstrokes

A generative art piece for museum projection, inspired by Van Gogh's brushwork patterns and the Kolmogorov turbulence research on *Starry Night*.

## Running the Visualization

Simply open `index.html` in a modern web browser, or serve it locally:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .
```

Then open `http://localhost:8000` in your browser.

## Controls

| Key | Action |
|-----|--------|
| `1` | The Potato Eaters (Nuenen, 1885) |
| `2` | Impressionist Light (Paris, 1886-87) |
| `3` | Sunflowers (Arles, 1888) |
| `4` | Starry Night (Saint-Rémy, 1889) |
| `5` | Almond Blossoms (Saint-Rémy, 1890) |
| `SPACE` | Pause/Resume |
| `R` | Reset particles |
| `F` | Toggle fullscreen |
| `H` | Hide/show info overlay |

## Museum Projection Notes

- Press `F` for fullscreen mode
- Press `H` to hide the info overlay for clean projection
- The visualization auto-cycles through all 5 periods (30 seconds each)
- Mouse movement subtly influences nearby particles

## Color Palettes

Each period uses authentic colors sampled from Van Gogh's paintings:

1. **Nuenen (1885)** — Dark earth tones, shadows
2. **Paris (1886-87)** — Soft pastels, impressionist influence
3. **Arles (1888)** — Vibrant yellows and cobalt blues
4. **Starry Night (1889)** — Deep blues with yellow stars, maximum turbulence
5. **Almond Blossoms (1890)** — Serene blues and white blossoms

## Technical Details

- **Flow field**: Multi-octave Perlin noise with spiral patterns
- **Turbulence**: Each period has different turbulence intensity
- **Particles**: 2000 particles leave brushstroke trails
- **Transitions**: Smooth color blending between periods
