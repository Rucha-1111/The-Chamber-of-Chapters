// Creates a handful of soft golden light particles that drift upward
// forever in the background. Purely decorative, purely CSS-driven —
// this script just spawns the elements and lets the CSS animate them.
(function () {
  const container = document.createElement("div");
  container.className = "sparkle-field";
  document.body.appendChild(container);

  const COUNT = 22;

  for (let i = 0; i < COUNT; i++) {
    const spark = document.createElement("span");
    spark.className = "spark";

    const size = 3 + Math.random() * 5; // px
    const left = Math.random() * 100; // %
    const duration = 9 + Math.random() * 10; // seconds
    const delay = Math.random() * -20; // stagger so they don't sync
    const drift = (Math.random() * 80 - 40).toFixed(0) + "px"; // sideways sway

    spark.style.width = size + "px";
    spark.style.height = size + "px";
    spark.style.left = left + "%";
    spark.style.animationDuration = duration + "s";
    spark.style.animationDelay = delay + "s";
    spark.style.setProperty("--drift", drift);

    container.appendChild(spark);
  }
})();
