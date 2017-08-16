---
variant_title: {{ replace .TranslationBaseName "-" " " | title }}
variant_name: {{ .BaseFileName }}
variant_path: {{ .Dir }}{{ .BaseFileName }}
variant_id: {{ .UniqueID }}
date: {{ .Date }}
draft: true
version: 0.0.0
tags:
  - {{ .Section }}
template: {{ .Section }}
config:
---
