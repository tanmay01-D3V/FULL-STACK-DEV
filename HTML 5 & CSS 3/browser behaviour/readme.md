1. Why does the same website look different on mobile and laptop?
Because mobile and laptops have different screen widths, pixel densities, and default scaling behavior. Browsers adapt layouts differently to make content readable on smaller screens.

2. What exactly changes when the meta viewport tag is added?
The viewport tag tells the browser:
1.Use the device’s actual screen width
2.Do not auto-zoom or shrink content
3.Without it, mobile browsers pretend the page is ~980px wide and scale it down.

3. Why does text appear very small on mobile if viewport is missing?
Because the browser shrinks the entire page to fit a large virtual width into a small physical screen, making text tiny.

4. How does CSS detect screen size?
CSS uses media queries:
1.@media (max-width: 768px) { }
2.These check the browser’s viewport width in pixels.

5. What happens when a breakpoint is crossed?
When the screen width crosses a breakpoint:
1.CSS rules switch
2.Layout, font sizes, and spacing change instantly
3.No reload happens — it’s real-time.

6. Why is layout design device-dependent?
Because:
1.Touch vs mouse interaction
2.Screen size limitations
3.Readability requirements
4.desktop layout often breaks usability on mobile.

7. Where does the browser store localStorage data?
1Inside the browser’s internal storage, specific to:
1.Domain (website)
2.Browser (Chrome, Edge, etc.)
3.You can see it in DevTools → Application → Local Storage

8. Why does stored data remain after refresh?
Because localStorage is:
1.Persistent
2.Not cleared on refresh
3.Not stored in memory (RAM)

9. How can a website work without internet?
If:
1.Files are already loaded
2.Logic runs locally (JS)
3.Data is stored in localStorage
4.Then no server is required.

10. How do learning platforms remember progress?
They store:
1.Progress data locally (localStorage / cookies)
2.Or sync it later to servers
Offline-first apps rely heavily on browser storage.