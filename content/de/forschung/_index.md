---
title: "Forschung"
translationKey: research
type: research
cascade:
  - type: research
  - params:
      category: dissertationen
    target:
      path: "/forschung/*-dissertation"
  - params:
      category: drittmittel
    target:
      path: "{/forschung/arapis,/forschung/motivierte-wissenschaftsrezeption,/forschung/nethate,/forschung/sensipov,/forschung/viscom}"
  - params:
      category: realkontexte
    target:
      path: "/forschung/egses24"
description: "Laufende und abgeschlossene Forschungsprojekte."
categorytitle: "Kategorie"
emptytext: "Einträge folgen."
showstatus: true
categories:
  - key: drittmittel
    label: "Drittmittelprojekte"
    badge: "Drittmittelprojekt"
  - key: dissertationen
    label: "Dissertationen"
    badge: "Dissertation"
  - key: realkontexte
    label: "Realkontexte"
    badge: "Realkontext"
---
