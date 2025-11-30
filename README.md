# REST Countries API with color theme switcher

#### A frontend mentor challenge using an API integration.

## Description

REST Countries API with color theme switcher: this project allows users to view different country information in the them of their choice.

## Table of Contents

- [Technologies Used](#technologiesused)
- [Features](#features)
- [Design](#design)
- [Project Next Steps](#nextsteps)
- [Deployed App](#deployment)
- [About the Author](#author)
- [Reflection](#reflection)

## <a name="technologiesused"></a>Technologies Used

- JavaScript
- HTML5
- CSS3
- Bootstrap 5 (CDN)

## Features

- Fetches country information from REST Countries API.
- Shows all countries, search by name, filter by region.
- Click a country to see details; click border codes to jump to neighbors.
- Light/dark toggle remembers theme and filters via localStorage.
- Uses `data.json` as a fallback if the API is slow or blocked.
- Keyboard-friendly cards allow you to select with tab and enter keys, visible focus, hidden labels.

## Trello Planning

- https://trello.com/b/hHUXhGfh/capstone-1

## <a name="design"></a>Design

- Design elements implemented using HTML5 and CSS3.

## <a name="nextsteps"></a>Project Next Steps

- Refactor using typescript
- Refactor using React

## <a name="deployment"></a>Deployed Link

[Github Pages](https://a-zeb.github.io/rest-countries-api-with-color-theme-switcher-master/)

- You can view the repository:
  [Github.com](https://github.com/a-zeb/rest-countries-api-with-color-theme-switcher-master)

## <a name="author"></a>About The Author

I am a software engineer with 4+ years of industry experience. I create this project for the PerScholas coding bootcamp to strengthen my foundational skills and learn some new ones.

## <a name="reflect"></a>Reflection

I built a simple page that pulls country info, shows a list, lets you search and filter, and then click a card to see more details. I kept it small: plain JavaScript, Bootstrap, and a light/dark toggle. The trickiest part was the API being slow sometimes, so I made it load the local data file first so the page doesn’t feel empty. I also added a tiny fallback in code so there’s always something to see.

Layout was mostly handled by Bootstrap’s grid, which made responsiveness easy without much thought. Accessibility took a few small steps: hidden labels for inputs, making cards focusable with Enter/Space to open details, and a status line that updates politely.

What I learned: asking the API for just the fields you need matters, and showing some kind of status/placeholder makes the app feel less broken when the network is slow. I also learned that keeping things simple (no extra build tools) made it faster to tweak but I would have really liked to build it with TypeScript from the ground up.

If I had more time, I’d show border country names instead of codes, add a nicer detail layout with more fields, and maybe add real routing so the detail view has its own URL. I’d also tighten up accessibility with better headings and focus management.
