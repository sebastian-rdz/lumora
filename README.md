# Lumora

A 3D cinema seat-map viewer built with React Three Fiber — pick a seat, then drop into a first-person view from that exact spot in the room.

---

## Features

- Interactive 3D cinema room with a seat map panel to browse and pick a seat
- POV mode: view the room from the selected seat, drag to look around like turning your head
- Toggleable house lights with real point lights and dynamic fog/ambient response
- Custom screen video picker — drop muted, looping clips into `src/assets/screens/` and select them from the panel
- Fullscreen toggle button
- Responsive field of view that adapts to the viewport

## Technologies Used

- React 19
- React Three Fiber + drei (Three.js)
- Vite

## Usage

- Run the app and choose a seat from the seat map panel
- Click "Ver desde este asiento" to jump into POV mode from that seat
- Drag to look around, use the HUD to toggle lights, pick a screen video, or go fullscreen
- Use "← Vista general" to return to the overview/orbit view

## Notes

- Screen videos must be muted/looping clips (mp4, webm) placed in `src/assets/screens/`

## Author

*Sebastián Rodríguez*
- [LinkedIn](https://www.linkedin.com/in/sebastian-rodriguez-zavala/)
- [Web](https://sebastianrdz.com)
- [Email](mailto:contact@sebastianrdz.com)

## License

This project is for personal use and is not licensed for commercial distribution.
