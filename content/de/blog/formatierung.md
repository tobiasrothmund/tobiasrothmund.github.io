---
title: "Beispiel: So sieht ein formatierter Beitrag aus"
date: 2026-09-15
translationKey: formatierung
draft: true
tags: ["Anleitung", "Methoden"]
summary: "Überschriften, Zitate, Listen, Tabellen, Bilder und Fußnoten – alles, was ein Blogbeitrag braucht, in einfachem Markdown."
toc: true
---

Dieser Beitrag zeigt, welche Gestaltungselemente Ihnen zur Verfügung stehen. Öffnen Sie die Datei `content/de/blog/formatierung.md`, um zu sehen, wie einfach sie geschrieben sind. **Diesen Beitrag können Sie später löschen.**

## Text und Hervorhebungen

Normaler Fließtext, **fett**, *kursiv* und [Links](https://www.uni-jena.de). Absätze entstehen durch eine Leerzeile.

## Zitate

> Die größte Gefahr für die Demokratie ist nicht die Lüge, sondern die Gleichgültigkeit gegenüber der Wahrheit.
>
> — Beispielzitat

## Listen

1. Erste Hypothese
2. Zweite Hypothese
3. Dritte Hypothese

## Tabellen

| Bedingung  | N   | M    | SD   |
|------------|-----|------|------|
| Kontrolle  | 212 | 3.41 | 1.02 |
| Treatment  | 207 | 3.88 | 0.97 |

## Bilder

Bilder legen Sie in `static/images/` ab und binden sie so ein:
`![Beschreibung](/images/dateiname.jpg)`

## Fußnoten

Wissenschaftliche Belege lassen sich elegant als Fußnote angeben.[^1]

[^1]: Muster, A. (2025). Ein Beispielartikel. *Journal of Examples*, 1, 1–10.
