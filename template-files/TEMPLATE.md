---
partner: ${PARTNER_NAME}
draft: true
version: 0.0.0
date: {{ .Date }}
variant_title: {{ replace .TranslationBaseName "-" " " | title }}
variant_name: {{ .BaseFileName }}
variant_path: {{ .Dir }}{{ .BaseFileName }}
variant_id: {{ .UniqueID }}
tags:
  - ${PARTNER_NAME}
  - ${TEMPLATE_NAME}
template: ${TEMPLATE_NAME}
config:
---
