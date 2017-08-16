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
  - personal
template: {{ .Section }}
config:
  hero:
    head: Sample Header
    subhead: Sample subheader
    body: Ut dolor labore nisi anim et irure ullamco qui adipisicing ut eu occaecat enim reprehenderit.
  header:
    image:
      url: img/ampush-red.png
      href: https://ampush.com
  footer:
    partnername: personal
    image: img/ampush-white.svg
    social:
      -
        href: http://facebook.com/hubblecontacts
        icon: img/facebook.svg
        class: facebook
      -
        href: http://instagram.com/hubblecontacts
        icon: img/instagram.svg
        class: instagram
      -
        href: http://twitter.com/hubblecontacts
        icon: img/twitter.svg
        class: twitter

    links:
      -
        key: Contact Us
        url: google.com
---
