# **Task 29: Ajustes Visuales (Espaciado y Contraste)**

*   [x] Corregir espaciado superior en sección Hero.
    *   Añadido `padding-top: 80px` (escritorio) y `100px` (móvil) para evitar que el menú oculte el título.
*   [x] Mejorar contraste de textos.
    *   Añadido `text-shadow` suave a títulos sobre fondos complejos (`.hero`, `.project-content`).
    *   Oscurecido el color de `.section-subtitle` para mejorar legibilidad sobre fondo claro.

---

### **Conclusión**

**Resumen:** Se solucionó el problema de visibilidad del título principal en dispositivos móviles agregando un espaciado superior dinámico que compensa la altura de la barra de navegación fija. Además, se mejoró la legibilidad general añadiendo sombras sutiles a los textos blancos sobre fondos degradados y oscureciendo los subtítulos grises.

**Observaciones:** Estos cambios mejoran significativamente la accesibilidad visual y la primera impresión del usuario en móviles.

**Mantenimiento Futuro:** Verificar el contraste si se cambian los colores del gradiente principal.
