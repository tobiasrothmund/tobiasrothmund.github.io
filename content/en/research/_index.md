---
title: "Research"
translationKey: research
type: research
cascade:
  - type: research
  - params:
      category: dissertationen
    target:
      path: "/research/*-dissertation"
  - params:
      category: drittmittel
    target:
      path: "{/research/arapis,/research/motivierte-wissenschaftsrezeption,/research/nethate,/research/sensipov,/research/viscom}"
  - params:
      category: realkontexte
    target:
      path: "/research/egses24"
description: "Ongoing and completed research projects."
categorytitle: "Category"
emptytext: "Entries to follow."
showstatus: true
categories:
  - key: drittmittel
    label: "Externally funded projects"
    badge: "Externally funded project"
  - key: dissertationen
    label: "Doctoral theses"
    badge: "Doctoral thesis"
  - key: realkontexte
    label: "Real-world settings"
    badge: "Real-world setting"
---
